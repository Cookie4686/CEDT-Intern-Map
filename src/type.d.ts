type Company = {
	companyId: number;
	companyNameTh: string;
	companyNameEn: string;
	logoUrl: string;
	website: string;
	facebook: string;
	line: string;
};

type Tag = {
	tagId: number;
	tagName: string;
};

type CompensationType = {
	compensationTypeId: number;
	compensationType: string;
};

type Application = {
	openingId: number;
	company: Company;
	title: string;
	description: string;
	quota: number;
	openForCooperativeInternship: boolean;
	compensationAmount: number;
	compensationType: CompensationType | null;
	workingCondition: string;
	requirements: null;
	tags: Tag[];
	officeName: string;
	officeAddressLine1: string;
	officeAddressLine2: string;
	recruitmentContactChannel: string;
	openingDetailContactChannel: string;
	startDate: null;
	endDate: null;
	isAcceptingApplication: boolean;
	inStudentDraftCount: number;
	longitude: number;
	latitude: number;
};
