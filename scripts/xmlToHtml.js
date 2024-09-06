const domParser = new DOMParser();

const readFileAsXml = (xmlFile) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      // Get file contents as string
      const xmlStr = event.target.result;

      // Parse string as XML
      const xmlDoc = domParser.parseFromString(xmlStr, "application/xml");

       // Check for parsing errors
      const errorNode = xmlDoc.querySelector("parsererror");
      if (errorNode) {
        reject(new Error("Error parsing document"));
      } else {
        resolve(xmlDoc);
      }
    };
    fileReader.onerror = () => reject(new Error("Error reading file"));
    fileReader.readAsText(xmlFile);
  });
};

const transformXml = async (xmlDoc, xsltPath) => {
  // Fetch XSLT document
  const xsltResponse = await fetch(xsltPath);
  const xsltString = await xsltResponse.text();
  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(
    domParser.parseFromString(xsltString, "application/xml")
  );

  // Transform XML document
  const fragment = xsltProcessor.transformToFragment(xmlDoc, document);
  return fragment;
};

export const readFileAndTransformXml = async (xmlFile, xsltPath) => {
  try {
    const xmlDoc = await readFileAsXml(xmlFile);
    const fragment = await transformXml(xmlDoc, xsltPath);
    return fragment;
  } catch (error) {
    console.error("Error processing XML:", error);
    throw error;
  }
};
