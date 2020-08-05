let CONTENT = {};
document.addEventListener('DOMContentLoaded',_=>
  document.getElementById('file').addEventListener('change',e=>{
    CONTENT = {};
    document.getElementById('dump-raw').innerHTML = '';
    document.getElementById('dump-transform').innerHTML = '';
    document.getElementById('raw').innerHTML = '';
    document.getElementById('transform').innerHTML = '';
    document.getElementById('result').classList.remove('show');
    Array.from(e.target.files).forEach(file=>loadFile(file));
  })
);

function loadFile(file) {
  let fileReader = new FileReader();
  CONTENT[file.name] = {};
  fileReader.onload = async function(ev) {
    await loadFileComplete(ev,file.name);

    dumpRawData();
    dumpTransformedData();

    document.getElementById('raw').innerHTML = getRawData("|","<br/>");
    document.getElementById('transform').innerHTML = getTransformedData("<br/>");

    document.getElementById('save-raw').setAttribute('href','data:text/plain;charset=utf-8,'+encodeURIComponent(getRawData("|","\n")));
    document.getElementById('save-transform').setAttribute('href','data:text/plain;charset=utf-8,'+encodeURIComponent(getTransformedData("\n")));

    document.getElementById('result').classList.add('show');
    document.getElementById('radio-dump-transform').checked = true;
  };
  fileReader.readAsArrayBuffer(file, "UTF-8");
}

async function loadFileComplete(ev,filename) {
  const pdf = await PDFJS.getDocument(new Uint8Array(ev.target.result));
  for(let c=1; c<=pdf.numPages; c++)
  {
    const page = await pdf.getPage(c);
    const fields = await page.getAnnotations();
    fields.forEach(item=>{
      CONTENT[filename][item.originalName] = item;
    });
  }
}

function getValue(field) {
  switch(field.formElementType) {
    case 'RADIO_BUTTON':
      return field.fieldValue && field.fieldValue.name ? field.fieldValue.name : '-';
      break;
    case 'CHECK_BOX':
      return field.fieldValue && field.fieldValue.name ? field.fieldValue.name : '-';
      break;
    default:
      return field.fieldValue;
      break;
  }
}
function getTransformedValue(filename,fieldname) {

  if(fieldname.match(/^__concat__/) && typeof COLUMNS[fieldname] !== 'undefined' && Array.isArray(TRANSLATIONS[fieldname]))
    return TRANSLATIONS[fieldname]
    .map(field=>typeof CONTENT[filename][field] === 'undefined' ? '' : getValue(CONTENT[filename][field]))
    .filter(val=>val && val.toString().length>0 && !val.match(/\s+/))
    .join(', ');

  if(typeof CONTENT[filename][fieldname] === 'undefined')
    return;

  const val = getValue(CONTENT[filename][fieldname]);
  return typeof TRANSLATIONS[fieldname] === 'undefined' ? val : TRANSLATIONS[fieldname][val.toString()];
}

function dumpRawData() {
  const target = document.getElementById('dump-raw');
  target.innerHTML = Object
    .keys(CONTENT)
    .map(filename=>(
      '<h1>'+filename+'</h1><table>'+
      Object
      .keys(CONTENT[filename])
      .map(fieldname=>'<tr><td>'+fieldname+'</td><td>'+getValue(CONTENT[filename][fieldname])+'</td></tr>')
      .join('')+
      '</table>'
      )
    )
    .join('<hr/>');
}
function dumpTransformedData() {
  const target = document.getElementById('dump-transform');
  target.innerHTML = Object
    .keys(CONTENT)
    .map(filename=>(
      '<h1>'+filename+'</h1><table>'+
      Object
      .keys(COLUMNS)
      .map(fieldname=>{
          const val = getTransformedValue(filename,fieldname);
          return typeof val === 'undefined' ? '' : '<tr><td>'+COLUMNS[fieldname]+'</td><td>'+val+'</td></tr>';
        })
      .join('')+
      '</table>'
      )
    )
    .join('<hr/>');
}
function getRawData(delimiter,linebreak) {
  // Get all the fields across ALL the files
  const allFields = Object
    .keys(CONTENT)
    .reduce((carry,filename)=>
      carry
      .concat(Object
        .keys(CONTENT[filename])
        .filter(fieldname=>carry.indexOf(fieldname)<0)
      ),[]);

  const text =
    "filename"+delimiter+allFields.join(delimiter)+linebreak
    +Object
    .keys(CONTENT)
    .map(filename=>(
      filename+delimiter+
      allFields
      .map(fieldname=>(typeof CONTENT[filename][fieldname] === 'undefined' ? '' : getValue(CONTENT[filename][fieldname])))
      .join(delimiter)))
    .join(linebreak);

  return text;
}
function getTransformedData(linebreak) {

  // Make the header row
  const header = "filename"+DELIMITER+Object.keys(COLUMNS).map(pdffieldname=>COLUMNS[pdffieldname]).join(DELIMITER)+linebreak;

  const files = Object.keys(CONTENT);

  const rows = files.map(filename=>{
    const row = filename+DELIMITER+
      Object.keys(COLUMNS)
        .map(pdffieldname=>{
          const val = getTransformedValue(filename,pdffieldname);
          return typeof val === 'undefined' ? '' : val;
        })
        .join(DELIMITER);
    return row;
  });

  return header + rows.join(linebreak);
}
