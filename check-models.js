const { GoogleGenerativeAI } = require("@google/generative-ai");

// Hardcode your key here just for this test (don't commit this file)
const genAI = new GoogleGenerativeAI("AIzaSyBjSfP34bBzoCY-qFxzBlevehtLy9k5LrY");

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log("Checking available models...");
    // There isn't a direct 'listModels' helper in the simple SDK, 
    // so we test the one we want directly.
    const result = await model.generateContent("Hello");
    console.log("SUCCESS! 'gemini-pro' works.");
    console.log(result.response.text());
  } catch (error) {
    console.log("Error:", error.message);
  }
}

listModels();