class ExportEncoder {
    ExportToLog(data: any) {
        if (data && data.length) {
            // For arrays, we stringify them separately and add line breaks
            var parts = data.map(part => {
                var asString = JSON.stringify(part);
                var asB64 = btoa(asString);
                return asB64;
            });

            return parts.join('\n');
        } else {
            // Simply return the b64 json data
            var asString = JSON.stringify(data);
            var asB64 = btoa(asString);
            return asB64;
        }
    }; 
}

export { ExportEncoder }

