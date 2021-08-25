import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';

const _format = (data) => {
	if (data.length) {
		return [
			{ text: data.address.street1 },
			{ text: data.address.street2 },
			{ text: data.address.city },
			{ text: data.address.state },
			{ text: data.address.zip },
		];
	} else {
		return [{}];
	}
};

export default function GenerateReport(homeData) {
	const { vfs } = vfsFonts.pdfMake;
	pdfMake.vfs = vfs;

	const formattedData = _format(homeData);

	const data = [{ text: 'street1' }, { text: 'street2' }];

	const documentDefinition = {
		pageSize: 'A4',
		pageOrientation: 'portiat',
		content: [{ text: 'HomeFax Report' }, '\n', formattedData],
	};

	pdfMake.createPdf(documentDefinition).open();
}
