import { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { motion } from "framer-motion";

const BillReader = ({ onExtract }) => {
  const { darkMode } = useTheme();
  const { success, error, warning } = useToast();
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Reset previous data before processing
      setImage(URL.createObjectURL(file));
      setText("");
      extractText(file);
    }
  };

  // Preprocess image for better OCR accuracy
  const preprocessImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      img.onload = () => {
        // Scale up image for better OCR (min 300 DPI equivalent)
        const scale = Math.max(1, 300 / 72); // Assume 72 DPI, scale to 300
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert to grayscale and enhance contrast
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          // Convert to grayscale
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          
          // Enhance contrast
          const enhanced = gray < 128 ? gray * 0.8 : Math.min(255, gray * 1.2);
          
          data[i] = enhanced;     // R
          data[i + 1] = enhanced;  // G
          data[i + 2] = enhanced;  // B
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/png", 1.0);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Comprehensive K-Electric bill extraction patterns
  const extractKEData = (text) => {
    const cleanText = text.trim();
    const results = {
      rawText: cleanText,
      confidence: 0,
      fields: {},
    };

    // Multiple extraction strategies for each field
    const strategies = {
      // Units Consumed (kWh) - Multiple patterns
      units: [
        /current\s*reading[\s:]*(\d+[\.,]?\d*)/i,
        /previous\s*reading[\s:]*(\d+[\.,]?\d*)/i,
        /(\d+[\.,]?\d*)\s*kWh/i,
        /(\d+[\.,]?\d*)\s*units/i,
        /units\s*consumed[\s:]*(\d+[\.,]?\d*)/i,
        /consumption[\s:]*(\d+[\.,]?\d*)/i,
        /(\d+[\.,]?\d*)\s*k\.?w\.?h/i,
      ],
      
      // Bill Amount (Rs)
      amount: [
        /total\s*(?:amount|bill|payable)[\s:]*Rs\.?\s*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)/i,
        /amount\s*due[\s:]*Rs\.?\s*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)/i,
        /Rs\.?\s*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)/i,
        /PKR\s*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)/i,
        /(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*rupees/i,
      ],
      
      // Bill Number
      billNumber: [
        /bill\s*(?:no|number|#)[\s:]*(\d{8,15})/i,
        /invoice\s*(?:no|number|#)[\s:]*(\d{8,15})/i,
        /bill\s*id[\s:]*(\d{8,15})/i,
        /reference\s*(?:no|number)[\s:]*(\d{8,15})/i,
      ],
      
      // Customer ID / Reference Number
      customerId: [
        /customer\s*(?:id|number|ref|reference)[\s:]*(\d{8,15})/i,
        /ref\s*(?:no|number)[\s:]*(\d{8,15})/i,
        /account\s*(?:no|number)[\s:]*(\d{8,15})/i,
        /consumer\s*(?:no|number)[\s:]*(\d{8,15})/i,
      ],
      
      // Customer Name
      customerName: [
        /customer\s*name[\s:]*(.{5,50})/i,
        /name[\s:]*(.{5,50})/i,
        /bill\s*to[\s:]*(.{5,50})/i,
      ],
      
      // Billing Period / Date
      billingPeriod: [
        /billing\s*period[\s:]*(.{5,30})/i,
        /period[\s:]*(.{5,30})/i,
        /from[\s:]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})[\s:]*to[\s:]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
      ],
      
      // Due Date
      dueDate: [
        /due\s*date[\s:]*(.{5,30})/i,
        /pay\s*by[\s:]*(.{5,30})/i,
        /payment\s*date[\s:]*(.{5,30})/i,
        /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})\s*\(due\)/i,
      ],
      
      // Previous Reading
      previousReading: [
        /previous\s*reading[\s:]*(\d+[\.,]?\d*)/i,
        /last\s*reading[\s:]*(\d+[\.,]?\d*)/i,
        /pr[\s:]*(\d+[\.,]?\d*)/i,
      ],
      
      // Current Reading
      currentReading: [
        /current\s*reading[\s:]*(\d+[\.,]?\d*)/i,
        /present\s*reading[\s:]*(\d+[\.,]?\d*)/i,
        /cr[\s:]*(\d+[\.,]?\d*)/i,
      ],
      
      // Tariff / Connection Type
      tariff: [
        /tariff[\s:]*(.{3,20})/i,
        /connection\s*type[\s:]*(.{3,20})/i,
        /category[\s:]*(.{3,20})/i,
      ],
    };

    // Extract each field using multiple strategies
    Object.keys(strategies).forEach((field) => {
      for (const pattern of strategies[field]) {
        const match = cleanText.match(pattern);
        if (match) {
          let value = match[1] || match[0];
          
          // Clean and format the value
          if (field === "units" || field === "previousReading" || field === "currentReading") {
            value = parseFloat(value.replace(/[, ]/g, "").replace(",", "."));
            if (value && value > 0) {
              results.fields[field] = value;
              results.confidence += 10;
              break;
            }
          } else if (field === "amount") {
            value = parseFloat(value.replace(/[, ]/g, "").replace(",", "."));
            if (value && value > 100 && value < 1000000) { // Reasonable bill range
              results.fields[field] = value;
              results.confidence += 15;
              break;
            }
          } else if (field === "billNumber" || field === "customerId") {
            value = value.replace(/[^\d]/g, "");
            if (value.length >= 8) {
              results.fields[field] = value;
              results.confidence += 10;
              break;
            }
          } else {
            value = value.trim().replace(/\s+/g, " ");
            if (value.length >= 3) {
              results.fields[field] = value;
              results.confidence += 5;
              break;
            }
          }
        }
      }
    });

    // Calculate units from readings if available
    if (!results.fields.units && results.fields.currentReading && results.fields.previousReading) {
      results.fields.units = Math.abs(results.fields.currentReading - results.fields.previousReading);
      results.confidence += 10;
    }

    // Normalize confidence (max 100)
    results.confidence = Math.min(100, results.confidence);

    return results;
  };

  const extractText = async (file) => {
    setLoading(true);
    setText("");
    setExtractedData(null);
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      error("File too large. Please upload an image under 10MB.");
      setLoading(false);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      error("Please upload a valid image file.");
      setLoading(false);
      return;
    }

    try {
      // Preprocess image for better OCR
      const processedBlob = await preprocessImage(file);
      
      // Use multiple OCR configurations for better accuracy
      const ocrConfigs = [
        { lang: "eng", options: { tessedit_pageseg_mode: "6" } }, // Assume uniform block of text
        { lang: "eng", options: { tessedit_pageseg_mode: "3" } }, // Fully automatic page segmentation
      ];

      let bestResult = null;
      let bestConfidence = 0;

      for (const config of ocrConfigs) {
        const result = await Tesseract.recognize(processedBlob, config.lang, {
          logger: (m) => {
            if (m.status === "recognizing text") {
              // Progress logging
            }
          },
        });

        const extracted = extractKEData(result.data.text);
        
        if (extracted.confidence > bestConfidence) {
          bestConfidence = extracted.confidence;
          bestResult = {
            ...extracted,
            rawText: result.data.text,
          };
        }
      }

      setText(bestResult.rawText);
      
      // Format final extracted data
      const finalData = {
        units: bestResult.fields.units || null,
        amount: bestResult.fields.amount || null,
        billNumber: bestResult.fields.billNumber || null,
        customerId: bestResult.fields.customerId || null,
        customerName: bestResult.fields.customerName || null,
        billingPeriod: bestResult.fields.billingPeriod || null,
        dueDate: bestResult.fields.dueDate || null,
        previousReading: bestResult.fields.previousReading || null,
        currentReading: bestResult.fields.currentReading || null,
        tariff: bestResult.fields.tariff || null,
        confidence: bestResult.confidence,
        rawText: bestResult.rawText,
      };
      
      setExtractedData(finalData);
      setLoading(false);
      
      if (finalData.units || finalData.amount) {
        const confidenceMsg = finalData.confidence >= 70 
          ? "Bill data extracted with high accuracy!" 
          : finalData.confidence >= 40 
          ? "Bill data extracted with moderate accuracy. Please verify." 
          : "Some data extracted. Please review carefully.";
        success(confidenceMsg);
        onExtract?.(finalData);
      } else {
        warning("Could not find bill data. Please ensure the image is clear and the bill is from K-Electric.");
      }
    } catch (err) {
      console.error("OCR error:", err);
      error("Failed to read bill. Please try with a clearer, well-lit image.");
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-xl sm:rounded-2xl shadow-lg border transition-all duration-300 p-4 sm:p-6 ${
        darkMode
          ? "bg-gray-900 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-900"
      } hover:shadow-xl`}
    >
      <h2
        className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center justify-center gap-2 ${
          darkMode ? "text-green-400" : "text-green-600"
        }`}
      >
        <span>📷</span> AI Bill Reader
      </h2>
      <p className={`text-xs sm:text-sm text-center mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        Upload K-Electric, LESCO, or other Pakistani utility bill images
      </p>

      <label
        className={`cursor-pointer flex flex-col items-center justify-center w-full py-6 sm:py-8 border-2 border-dashed rounded-xl transition min-h-[120px] sm:min-h-[150px]
          ${loading ? "opacity-60 cursor-wait" : "hover:border-green-500"} 
          ${
            darkMode
              ? "border-gray-700 text-gray-400"
              : "border-gray-300 text-gray-600"
          }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={loading}
          className="hidden"
        />

        {!image && !loading && (
          <div className="text-xs sm:text-sm text-center px-4">
            Click to upload or drag & drop your bill image here
          </div>
        )}

        {loading && (
          <p className="text-green-500 animate-pulse text-sm">
            🔍 Reading your bill, please wait...
          </p>
        )}

              {image && !loading && (
                <img
                  src={image}
                  alt="Uploaded bill"
                  className="mt-3 rounded-lg shadow-md w-full max-w-sm mx-auto object-contain"
                />
              )}
      </label>

      {extractedData && !loading && (
        <div className="mt-4 space-y-3">
          <div
            className={`rounded-lg p-4 ${
              darkMode ? "bg-green-900/20 border border-green-500/30" : "bg-green-50 border border-green-200"
            }`}
          >
            <h3
              className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                darkMode ? "text-green-400" : "text-green-700"
              }`}
            >
              <span>✓</span> Extracted Bill Data
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {extractedData.units && (
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Units (kWh)</p>
                  <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 break-words">
                    {extractedData.units.toLocaleString()}
                  </p>
                </div>
              )}
              {extractedData.amount && (
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Amount</p>
                  <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 break-words">
                    Rs {extractedData.amount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <details className={`rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
            <summary
              className={`text-xs p-2 cursor-pointer ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              View Raw Text
            </summary>
            <pre
              className={`text-xs p-3 overflow-auto max-h-48 whitespace-pre-wrap leading-relaxed ${
                darkMode ? "text-gray-300" : "text-gray-800"
              }`}
            >
              {text}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default BillReader;
