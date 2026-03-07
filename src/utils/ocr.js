import Tesseract from "tesseract.js";

export async function extractTextFromImage(image_path){
  
  const result = await Tesseract.recognize(
    image_path,
    "por",
     {
      logger: m => console.log(m)
     }
    );
  return result.data.text;
}