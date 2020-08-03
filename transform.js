const DELIMITER = "|";

const COLUMNS = {
  "Service Number":"Service Number",
  "Age":"Age",
  "Gender":"Group17",
  "Medical Category":"Group19",
  "PDI1 Family Home Resp":"Group23",
};

const VALUES = {
  "Gender":{"0":"M","1":"F","2":"O"},
  "Medical Category":{"0":"None","1":"TCAT","2":"PCAT"},
};

function getTransformedData(linebreak) {

  // Make the header row
  const header = "filename"+DELIMITER+Object.keys(COLUMNS).join(DELIMITER)+linebreak;

  const files = Object.keys(CONTENT);

  const rows = files.map(filename=>{
    const row = filename+DELIMITER+
      Object.keys(COLUMNS)
        .map(csvcolumn=>{
          pdffieldname = COLUMNS[csvcolumn];
          if(typeof CONTENT[filename][pdffieldname] === 'undefined')
            return '';

          let val = getValue(CONTENT[filename][pdffieldname]);
          if(typeof VALUES[csvcolumn] !== 'undefined')
            val = VALUES[csvcolumn][val.toString()];

          return val;
        })
        .join(DELIMITER);
    return row;
  });

  return header + rows.join(linebreak);
}
