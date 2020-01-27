class ExportEncoder {
	ExportToLog(data: any) {
		var asString = JSON.stringify(data);
		var asB64 = btoa(asString);
		return asB64;
	}; 
}

export { ExportEncoder }

