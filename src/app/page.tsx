"use client";

import { ScatterplotLayer } from "@deck.gl/layers";
import { DeckGL, DeckGLRef } from "@deck.gl/react";
import { useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import "maplibre-gl/dist/maplibre-gl.css";
import { Map } from "react-map-gl/maplibre";
import { useDebouncedCallback } from "use-debounce";

import { MultiSelect } from "@/components/multiselect";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import applicationList from "@/lib/data/application_list.json";
import meta from "@/lib/data/meta.json";
import tags from "@/lib/data/tags.json";

export default function Home() {
	const [selectedValues, setSelectedValues] = useState<string[]>([]);
	const [mapLoaded, setMapLoaded] = useState<boolean>(false);
	const [openingIdOnMap, setOpeningIdOnMap] = useState<number[]>([]);
	const deckRef = useRef<DeckGLRef>(null);

	const handleOnRefresh = useDebouncedCallback(
		() => {
			if (mapLoaded && deckRef.current?.deck) {
				setOpeningIdOnMap(
					deckRef.current.deck
						.pickObjects({
							x: 0,
							y: 0,
							width: deckRef.current.deck.width,
							height: deckRef.current.deck.height,
						})
						.flatMap((e) => e.object.openingIds)
				);
			}
		},
		950,
		{ leading: false, trailing: true }
	);

	const handleOnLoad = () => {
		setMapLoaded(true);
		// handleOnRefresh();
	};

	// Filter Data
	const filteredData = applicationList.filter((x) => {
		return (
			x.latitude
			&& x.longitude
			&& (!selectedValues.length
				|| x.tags.find((x) =>
					selectedValues.find((e) => e === x.tagId.toString())
				))
		);
	}) as unknown as Application[];

	// Group Data in the same address
	const groupedData = Object.groupBy(filteredData, (e) => e.officeAddressLine1);
	const groupedDataEntries = Object.entries(groupedData);
	const groupedResult: {
		address: string;
		latitude: number;
		longitude: number;
		openingIds: number[];
		tooltip: { html: string };
	}[] = [];

	// Aggregate Tooltip to display applications info in that address
	for (const [address, applications] of groupedDataEntries) {
		if (!applications) continue;

		const groupedCompanyData = Object.groupBy(
			applications,
			(e) => e.company.companyNameTh
		);

		const tooltips: React.JSX.Element[] = [];
		const openingIds: number[] = [];

		for (const [companyNameTh, applications] of Object.entries(
			groupedCompanyData
		)) {
			if (!applications) continue;

			const companyTooltips: React.JSX.Element[] = [];

			for (const application of applications) {
				openingIds.push(application.openingId);
				companyTooltips.push(
					<li className="max-w-4xl" key={application.openingId}>
						<span className="font-bold">{application.title} </span>
						<span>
							{application.compensationAmount ?
								`${application.compensationAmount} ${application.compensationType?.compensationType}`
							:	`ไม่ระบุค่าตอบแทน`}
						</span>
					</li>
				);
			}

			tooltips.push(
				<div key={companyNameTh}>
					<p className="text-xl font-bold">{companyNameTh}</p>
					<ul className="list-inside list-decimal">{companyTooltips}</ul>
				</div>
			);
		}

		groupedResult.push({
			address,
			latitude: applications[0].latitude,
			longitude: applications[0].longitude,
			openingIds,
			tooltip: {
				html: ReactDOMServer.renderToStaticMarkup(
					<div>
						<div>{tooltips}</div>
						<p>{address}</p>
					</div>
				),
			},
		});
	}

	const layer = new ScatterplotLayer<(typeof groupedResult)[number]>({
		data: groupedResult,
		getPosition: (d) => [d.longitude, d.latitude],
		getRadius: 40,
		getFillColor: [255, 25, 0],
		stroked: false,
		pickable: true,
	});

	return (
		<ResizablePanelGroup className="flex min-h-screen" direction="horizontal">
			<ResizablePanel defaultSize={30}>
				<div className="flex h-screen flex-col gap-4 overflow-auto bg-teal-50 p-2">
					<div>
						<h1 className="text-center">Internship Map (v1.0)</h1>
						<p className="text-center text-sm">
							Last Data Update
							<br />
							{meta.lastUpdate}
						</p>
					</div>

					<Separator />

					<div>
						<h2 className="text-center">Filter By Tags</h2>
						<MultiSelect
							className="max-w-full"
							options={tags.map((e) => ({
								label: e.tagName,
								value: e.tagId.toString(),
							}))}
							onValueChange={(e) => {
								setSelectedValues(e);
							}}
							defaultValue={selectedValues}
						/>
					</div>

					<Separator />

					<div>
						<h2 className="text-center">Filtered Data On Map</h2>
						<OpeningList
							companyEntries={Object.entries(
								Object.groupBy(
									filteredData.filter((e) =>
										openingIdOnMap.includes(e.openingId)
									),
									(e) => e.company.companyNameTh
								)
							)}
						/>
					</div>

					<Separator className="my-4" />

					<div>
						<h2 className="text-center">Filtered Data Not On Map</h2>
						<OpeningList
							companyEntries={Object.entries(
								Object.groupBy(
									filteredData.filter(
										(e) => !openingIdOnMap.includes(e.openingId)
									),
									(e) => e.company.companyNameTh
								)
							)}
						/>
					</div>

					<Separator className="my-4" />

					<div>
						<h2 className="text-center">Data Without auto-detected Location</h2>
						<OpeningList
							companyEntries={Object.entries(
								Object.groupBy(
									(applicationList as unknown as Application[]).filter(
										(e) => !e.latitude || !e.longitude
									),
									(e) => e.company.companyNameTh
								)
							)}
						/>
					</div>
				</div>
			</ResizablePanel>

			<ResizableHandle withHandle />

			<ResizablePanel defaultSize={70} className="relative">
				<div>
					<DeckGL
						ref={deckRef}
						initialViewState={{
							latitude:
								filteredData.reduce((carry, e) => carry + e.latitude, 0)
								/ filteredData.length,
							longitude:
								filteredData.reduce((carry, e) => carry + e.longitude, 0)
								/ filteredData.length,
							zoom: 12,
						}}
						onViewStateChange={handleOnRefresh}
						onLoad={handleOnLoad}
						layers={[layer]}
						getTooltip={({ object }) => {
							if (!object) return null;
							return object.tooltip;
						}}
						controller
					>
						<Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"></Map>
					</DeckGL>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}

function OpeningList({
	companyEntries,
}: {
	companyEntries: [string, Application[] | undefined][];
}) {
	return companyEntries.map(([company, applications]) => (
		<div className="pb-2" key={company}>
			<p className="font-bold">{company}</p>
			<div className="flex flex-col text-sm">
				{applications?.map((e) => (
					<a
						className="inline-flex underline-offset-4 hover:underline"
						href={`https://cedtintern.cp.eng.chula.ac.th/opening/${e.openingId}/session/5`}
						target="_blank"
						key={e.openingId}
					>
						{`${e.title} (${e.quota}) ${
							e.compensationAmount ?
								`${e.compensationAmount} ${e.compensationType?.compensationType}`
							:	`ไม่ระบุค่าตอบแทน`
						}`}
					</a>
				))}
			</div>
		</div>
	));
}
