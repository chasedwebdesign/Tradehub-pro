const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

// Load the key from your .env.local file
dotenv.config({ path: ".env.local" });

const key = process.env.GEMINI_API_KEY;
console.log("Testing Key:", key ? "Found (Length " + key.length + ")" : "MISSING");

const genAI = new GoogleGenerativeAI(key);

async function checkModels() {
  try {
    // This asks Google: "What models can I use?"
    // Note: We use the 'getGenerativeModel' on a fake model just to access the client, 
    // but really we want to simulate a list request if possible, 
    // or just try the most common ones one-by-one.
    
    // Since the SDK doesn't have a simple "listModels" helper exposed easily in Node,
    // we will brute-force test the 3 most likely names.
    
    const candidates = [
      "gemini-1.5-flash", 
      "gemini-1.5-flash-latest",
      "gemini-1.0-pro",
      "gemini-pro"
    ];

    console.log("\n--- STARTING MODEL TEST ---");
    
    for (const modelName of candidates) {
      process.stdout.write(`Testing '${modelName}'... `);
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        console.log("✅ SUCCESS!");
        console.log("Response:", response.text());
        console.log(">>> USE THIS MODEL NAME IN YOUR APP: " + modelName);
        return; // Stop after finding one that works
      } catch (e) {
        console.log("❌ FAILED (" + e.message.split('[')[0] + ")");
      }
    }
  } catch (error) {
    console.error("Fatal Error:", error);
  }
}

checkModels();