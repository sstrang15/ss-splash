
export function parseCSV(csv) {

    let records = [];
    const rows = csv.trim().split("\n");
    const headers = rows[0].split(",");

    let insideQuotes = false;
    let record = {};
    let text = "";

    for (let i = 1; i < rows.length; i++) {

        let row = rows[i];
        let comma_counter = 0;

        for (let j = 0; j < row.length; j++) {

            const character = row[j];
            const nextCharacter = row[j + 1];

            if (character === "\"" && insideQuotes && nextCharacter === "\"") {

                text += "\"";
                j++;

            } else if (character === "\"" && !insideQuotes) {

                insideQuotes = true;

            } else if (character === "\"" && insideQuotes) {

                insideQuotes = false;

            } else if (character === "," && !insideQuotes) {

                record[headers[comma_counter]] = text;
                text = "";
                comma_counter++;

            } else {

                text += character;
            }
        }

        record[headers[comma_counter]] = text;
        text = "";

        records.push(record);
        record = {};
    }

    return records;
}