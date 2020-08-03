let CONTENT = {};
document.addEventListener('DOMContentLoaded',_=>
  document.getElementById('file').addEventListener('change',e=>{
    CONTENT = {};
    document.getElementById('dump').innerHTML = '';
    document.getElementById('raw').innerHTML = '';
    document.getElementById('result').classList.remove('show');
    Array.from(e.target.files).forEach(file=>loadFile(file));
  })
);

function loadFile(file) {
  let fileReader = new FileReader();
  CONTENT[file.name] = {};
  fileReader.onload = async function(ev) {
    await loadFileComplete(ev,file.name);
    dumpData();

    document.getElementById('raw').innerHTML = getCsv("|","<br/>");
    document.getElementById('transform').innerHTML = getTransformedData("<br/>");

    document.getElementById('save-raw').setAttribute('href','data:text/plain;charset=utf-8,'+encodeURIComponent(getCsv("|","\n")));
    document.getElementById('save-transform').setAttribute('href','data:text/plain;charset=utf-8,'+encodeURIComponent(getTransformedData("\n")));

    document.getElementById('result').classList.add('show');
    document.getElementById('radio-dump').checked = true;
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
function getCsv(delimiter,linebreak) {
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
function dumpData() {
  const target = document.getElementById('dump');
  target.innerHTML = Object
    .keys(CONTENT)
    .map(filename=>(
      '<h1>'+filename+'</h1><br/>'+
      Object
      .keys(CONTENT[filename])
      .map(fieldname=>fieldname+": "+getValue(CONTENT[filename][fieldname]))
      .join('<br/>')))
    .join('<hr/>');
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
