let _content = {};
document.addEventListener('DOMContentLoaded',_=>
  document.getElementById('file').addEventListener('change',e=>{
    _content = {};
    document.getElementById('dump').innerHTML = '';
    document.getElementById('csv').innerHTML = '';
    document.getElementById('download').classList.remove('show');
    Array.from(e.target.files).forEach(file=>loadFile(file));
  })
);

function loadFile(file) {
  let fileReader = new FileReader();
  _content[file.name] = {};
  fileReader.onload = async function(ev) {
    await loadFileComplete(ev,file.name);
    dumpData();
    printCsv();
    printCsvFile();
    document.getElementById('radio-dump').checked = true;
    document.getElementById('download').classList.add('show');
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
      _content[filename][item.originalName] = item;
    });
  }
}
function getCsv(delimiter,linebreak) {
  // Get all the fields across ALL the files
  const allFields = Object
    .keys(_content)
    .reduce((carry,filename)=>
      carry
      .concat(Object
        .keys(_content[filename])
        .filter(fieldname=>carry.indexOf(fieldname)<0)
      ),[]);

  const text =
    "filename"+delimiter+allFields.join(delimiter)+linebreak
    +Object
    .keys(_content)
    .map(filename=>(
      filename+delimiter+
      allFields
      .map(fieldname=>(typeof _content[filename][fieldname] === 'undefined' ? '' : getValue(_content[filename][fieldname])))
      .join(delimiter)))
    .join(linebreak);

  return text;
}
function printCsv() {
  const target = document.getElementById('csv');
  target.innerHTML = getCsv("|","<br/>");

}
function printCsvFile() {
  const target = document.getElementById('download');
  target.setAttribute('href','data:text/plain;charset=utf-8,'+encodeURIComponent(getCsv("|","\n")));
}
function dumpData() {
  const target = document.getElementById('dump');
  target.innerHTML = Object
    .keys(_content)
    .map(filename=>(
      '<h1>'+filename+'</h1><br/>'+
      Object
      .keys(_content[filename])
      .map(fieldname=>fieldname+": "+getValue(_content[filename][fieldname]))
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

