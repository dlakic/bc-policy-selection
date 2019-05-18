module.exports.violationsExtractor = (sheets, minTemp, maxTemp) => {
    let violationsAmount = 0;
    const violations = [];
    sheets.forEach((sheet) => {
        const violationDataForSheet = {
            size: 0,
            data: [],
            sizeString: 0,
            dataString: '',
        };
        sheet.data.forEach((row) => {
            const violationData = row.filter(temp => temp > maxTemp || temp < minTemp);
            violationsAmount = violationsAmount + violationData.length;
             violationData.forEach((temp) => {
                 violationDataForSheet.size = violationDataForSheet.size + Buffer.byteLength(temp.toString(), 'utf8');
            });
            violationDataForSheet.data.push(...violationData);
        });
        violationDataForSheet.dataString = violationDataForSheet.data.join();
        violationDataForSheet.sizeString = Buffer.byteLength(violationDataForSheet.dataString, 'utf8');
        violations.push(violationDataForSheet)
    });

    return {violationsAmount, violations}
};

module.exports.prepareHash= (hash) => {
    return {
        sizeString:  Buffer.byteLength(hash, 'utf8'),
        dataString: hash,
    };
};