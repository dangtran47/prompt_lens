import { MOCK_CONFIG } from "../config/mockConfig";

// Mock response data for different providers
export const MOCK_RESPONSES: {
  [provider: string]: {
    translation: { [key: string]: string };
    summary: { [key: string]: string };
  };
} = {
  openai: {
    translation: {
      "Hello world": "Xin chào thế giới",
      "How are you?": "Bạn khỏe không?",
      "Thank you": "Cảm ơn bạn",
      "Good morning": "Chào buổi sáng",
      "Good night": "Chúc ngủ ngon",
      "I love you": "Tôi yêu bạn",
      "What is your name?": "Tên bạn là gì?",
      "Where are you from?": "Bạn đến từ đâu?",
      "How old are you?": "Bạn bao nhiêu tuổi?",
      "Nice to meet you": "Rất vui được gặp bạn"
    },
    summary: {
      "This is a very long text that needs to be summarized. It contains many sentences and paragraphs that should be condensed into a brief summary.":
        "A comprehensive text requiring summarization with multiple detailed sections.",
      "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet.":
        "A classic pangram demonstrating all alphabet letters in a coherent sentence.",
      "Artificial intelligence is transforming the way we live and work. It has applications in healthcare, education, transportation, and many other fields.":
        "AI is revolutionizing multiple industries including healthcare, education, and transportation with widespread impact.",
      "Climate change is one of the most pressing issues of our time. It affects weather patterns, sea levels, and biodiversity across the globe.":
        "Climate change represents a critical global challenge affecting weather systems, ocean levels, and ecological diversity worldwide.",
      "The internet has revolutionized communication and information sharing. It connects billions of people worldwide and provides access to vast amounts of knowledge.":
        "The internet has fundamentally transformed global communication networks and democratized access to information on an unprecedented scale."
    }
  },
  anthropic: {
    translation: {
      "Hello world": "Chào thế giới",
      "How are you?": "Bạn thế nào?",
      "Thank you": "Cảm ơn",
      "Good morning": "Chào buổi sáng",
      "Good night": "Chúc ngủ ngon",
      "I love you": "Tôi yêu bạn",
      "What is your name?": "Bạn tên gì?",
      "Where are you from?": "Bạn từ đâu đến?",
      "How old are you?": "Bạn bao nhiêu tuổi?",
      "Nice to meet you": "Rất vui được gặp bạn"
    },
    summary: {
      "This is a very long text that needs to be summarized. It contains many sentences and paragraphs that should be condensed into a brief summary.":
        "An extensive document requiring concise summarization of its multiple sections and detailed content.",
      "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet.":
        "A traditional pangram showcasing complete alphabet coverage in a meaningful sentence structure.",
      "Artificial intelligence is transforming the way we live and work. It has applications in healthcare, education, transportation, and many other fields.":
        "AI technology is fundamentally reshaping societal structures across healthcare, education, transportation, and numerous other sectors.",
      "Climate change is one of the most pressing issues of our time. It affects weather patterns, sea levels, and biodiversity across the globe.":
        "Climate change stands as humanity's most urgent contemporary challenge, impacting global weather systems, oceanic conditions, and biological diversity.",
      "The internet has revolutionized communication and information sharing. It connects billions of people worldwide and provides access to vast amounts of knowledge.":
        "The internet represents a paradigm shift in human connectivity and knowledge accessibility, linking billions globally while democratizing information access."
    }
  },
  openrouter: {
    translation: {
      "Hello world": "Xin chào thế giới",
      "How are you?": "Bạn có khỏe không?",
      "Thank you": "Cảm ơn bạn",
      "Good morning": "Chào buổi sáng",
      "Good night": "Chúc ngủ ngon",
      "I love you": "Tôi yêu bạn",
      "What is your name?": "Tên của bạn là gì?",
      "Where are you from?": "Bạn đến từ đâu?",
      "How old are you?": "Bạn bao nhiêu tuổi?",
      "Nice to meet you": "Rất vui được gặp bạn"
    },
    summary: {
      "This is a very long text that needs to be summarized. It contains many sentences and paragraphs that should be condensed into a brief summary.":
        "A lengthy document requiring summarization of its comprehensive content and multiple sections.",
      "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet.":
        "A well-known pangram that demonstrates complete alphabet usage in a coherent sentence.",
      "Artificial intelligence is transforming the way we live and work. It has applications in healthcare, education, transportation, and many other fields.":
        "AI is dramatically changing society across healthcare, education, transportation, and various other industries.",
      "Climate change is one of the most pressing issues of our time. It affects weather patterns, sea levels, and biodiversity across the globe.":
        "Climate change is a critical global issue affecting weather, sea levels, and biodiversity worldwide.",
      "The internet has revolutionized communication and information sharing. It connects billions of people worldwide and provides access to vast amounts of knowledge.":
        "The internet has transformed global communication and made information accessible to billions of people worldwide."
    }
  },
  cohere: {
    translation: {
      "Hello world": "Chào thế giới",
      "How are you?": "Bạn thế nào?",
      "Thank you": "Cảm ơn",
      "Good morning": "Chào buổi sáng",
      "Good night": "Chúc ngủ ngon",
      "I love you": "Tôi yêu bạn",
      "What is your name?": "Bạn tên gì?",
      "Where are you from?": "Bạn từ đâu?",
      "How old are you?": "Bạn bao nhiêu tuổi?",
      "Nice to meet you": "Rất vui được gặp bạn"
    },
    summary: {
      "This is a very long text that needs to be summarized. It contains many sentences and paragraphs that should be condensed into a brief summary.":
        "A comprehensive document that requires summarization of its extensive content and multiple sections.",
      "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet.":
        "A classic pangram that includes every letter of the alphabet in a meaningful sentence.",
      "Artificial intelligence is transforming the way we live and work. It has applications in healthcare, education, transportation, and many other fields.":
        "AI is revolutionizing various sectors including healthcare, education, and transportation.",
      "Climate change is one of the most pressing issues of our time. It affects weather patterns, sea levels, and biodiversity across the globe.":
        "Climate change is a critical global challenge affecting weather, oceans, and biodiversity.",
      "The internet has revolutionized communication and information sharing. It connects billions of people worldwide and provides access to vast amounts of knowledge.":
        "The internet has transformed global communication and information access for billions of people."
    }
  },
  huggingface: {
    translation: {
      "Hello world": "Xin chào thế giới",
      "How are you?": "Bạn khỏe không?",
      "Thank you": "Cảm ơn",
      "Good morning": "Chào buổi sáng",
      "Good night": "Chúc ngủ ngon",
      "I love you": "Tôi yêu bạn",
      "What is your name?": "Tên bạn là gì?",
      "Where are you from?": "Bạn đến từ đâu?",
      "How old are you?": "Bạn bao nhiêu tuổi?",
      "Nice to meet you": "Rất vui được gặp bạn"
    },
    summary: {
      "This is a very long text that needs to be summarized. It contains many sentences and paragraphs that should be condensed into a brief summary.":
        "A long text requiring summarization with multiple sentences and paragraphs.",
      "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet.":
        "A pangram containing all alphabet letters.",
      "Artificial intelligence is transforming the way we live and work. It has applications in healthcare, education, transportation, and many other fields.":
        "AI is revolutionizing various industries including healthcare, education, and transportation.",
      "Climate change is one of the most pressing issues of our time. It affects weather patterns, sea levels, and biodiversity across the globe.":
        "Climate change is a critical global issue impacting weather, sea levels, and biodiversity.",
      "The internet has revolutionized communication and information sharing. It connects billions of people worldwide and provides access to vast amounts of knowledge.":
        "The internet has transformed global communication and information access."
    }
  },
  replicate: {
    translation: {
      "Hello world": "Chào thế giới",
      "How are you?": "Bạn thế nào?",
      "Thank you": "Cảm ơn",
      "Good morning": "Chào buổi sáng",
      "Good night": "Chúc ngủ ngon",
      "I love you": "Tôi yêu bạn",
      "What is your name?": "Bạn tên gì?",
      "Where are you from?": "Bạn từ đâu?",
      "How old are you?": "Bạn bao nhiêu tuổi?",
      "Nice to meet you": "Rất vui được gặp bạn"
    },
    summary: {
      "This is a very long text that needs to be summarized. It contains many sentences and paragraphs that should be condensed into a brief summary.":
        "A lengthy document requiring summarization of its comprehensive content.",
      "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet.":
        "A traditional pangram demonstrating complete alphabet usage.",
      "Artificial intelligence is transforming the way we live and work. It has applications in healthcare, education, transportation, and many other fields.":
        "AI is fundamentally changing society across multiple sectors including healthcare, education, and transportation.",
      "Climate change is one of the most pressing issues of our time. It affects weather patterns, sea levels, and biodiversity across the globe.":
        "Climate change represents humanity's most urgent challenge, affecting global weather, oceans, and biodiversity.",
      "The internet has revolutionized communication and information sharing. It connects billions of people worldwide and provides access to vast amounts of knowledge.":
        "The internet has revolutionized global connectivity and democratized access to information for billions worldwide."
    }
  },
  together: {
    translation: {
      "Hello world": "Xin chào thế giới",
      "How are you?": "Bạn có khỏe không?",
      "Thank you": "Cảm ơn bạn",
      "Good morning": "Chào buổi sáng",
      "Good night": "Chúc ngủ ngon",
      "I love you": "Tôi yêu bạn",
      "What is your name?": "Tên của bạn là gì?",
      "Where are you from?": "Bạn đến từ đâu?",
      "How old are you?": "Bạn bao nhiêu tuổi?",
      "Nice to meet you": "Rất vui được gặp bạn"
    },
    summary: {
      "This is a very long text that needs to be summarized. It contains many sentences and paragraphs that should be condensed into a brief summary.":
        "An extensive document requiring concise summarization of its detailed content and multiple sections.",
      "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet.":
        "A well-known pangram that includes every letter of the alphabet in a coherent sentence.",
      "Artificial intelligence is transforming the way we live and work. It has applications in healthcare, education, transportation, and many other fields.":
        "AI technology is dramatically reshaping society across healthcare, education, transportation, and numerous other sectors.",
      "Climate change is one of the most pressing issues of our time. It affects weather patterns, sea levels, and biodiversity across the globe.":
        "Climate change stands as our era's most critical challenge, impacting global weather systems, oceanic conditions, and biological diversity.",
      "The internet has revolutionized communication and information sharing. It connects billions of people worldwide and provides access to vast amounts of knowledge.":
        "The internet has fundamentally transformed human connectivity and knowledge accessibility, linking billions globally while democratizing information."
    }
  },
  local: {
    translation: {
      "Hello world": "Chào thế giới",
      "How are you?": "Bạn thế nào?",
      "Thank you": "Cảm ơn",
      "Good morning": "Chào buổi sáng",
      "Good night": "Chúc ngủ ngon",
      "I love you": "Tôi yêu bạn",
      "What is your name?": "Bạn tên gì?",
      "Where are you from?": "Bạn từ đâu?",
      "How old are you?": "Bạn bao nhiêu tuổi?",
      "Nice to meet you": "Rất vui được gặp bạn"
    },
    summary: {
      "This is a very long text that needs to be summarized. It contains many sentences and paragraphs that should be condensed into a brief summary.":
        "A long document that needs summarization of its content.",
      "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet.":
        "A pangram with all alphabet letters.",
      "Artificial intelligence is transforming the way we live and work. It has applications in healthcare, education, transportation, and many other fields.":
        "AI is changing society in healthcare, education, and transportation.",
      "Climate change is one of the most pressing issues of our time. It affects weather patterns, sea levels, and biodiversity across the globe.":
        "Climate change is a global issue affecting weather and biodiversity.",
      "The internet has revolutionized communication and information sharing. It connects billions of people worldwide and provides access to vast amounts of knowledge.":
        "The internet has changed global communication and information access."
    }
  }
};

// Function to get mock response based on provider
export const getMockResponse = (text: string, isTranslation: boolean, provider: string): string => {
  // Get provider-specific responses, fallback to "local" if not found
  const providerResponses = MOCK_RESPONSES[provider] || MOCK_RESPONSES["local"];
  const responses = isTranslation ? providerResponses.translation : providerResponses.summary;

  // Try to find exact match first
  if (responses[text]) {
    return responses[text];
  }

  // If no exact match, generate a provider-specific generic response
  if (isTranslation) {
    const providerNames: { [key: string]: string } = {
      openai: "OpenAI GPT",
      anthropic: "Anthropic Claude",
      openrouter: "OpenRouter",
      cohere: "Cohere",
      huggingface: "HuggingFace",
      replicate: "Replicate",
      together: "Together AI",
      local: "Local/Ollama"
    };
    const modelName = providerNames[provider] || "AI Model";
    return `[${modelName} MOCK TRANSLATION] ${text} → Vietnamese translation`;
  } else {
    const providerNames: { [key: string]: string } = {
      openai: "OpenAI GPT",
      anthropic: "Anthropic Claude",
      openrouter: "OpenRouter",
      cohere: "Cohere",
      huggingface: "HuggingFace",
      replicate: "Replicate",
      together: "Together AI",
      local: "Local/Ollama"
    };
    const modelName = providerNames[provider] || "AI Model";
    return `[${modelName} MOCK SUMMARY] This is a summary of the provided text: "${text.substring(
      0,
      50
    )}..."`;
  }
};

// Mock streaming response generator
export const generateMockStream = async (
  text: string,
  isTranslation: boolean,
  provider: string,
  sendMessage: (data: any) => void
) => {
  const mockResponse = getMockResponse(text, isTranslation, provider);
  const words = mockResponse.split(" ");

  // Simulate streaming by sending words one by one with delays
  for (let i = 0; i < words.length; i++) {
    let chunk: any;

    // Generate provider-specific response formats
    console.log("provider", provider);
    switch (provider) {
      case "openai":
      case "openrouter":
        chunk = {
          choices: [
            {
              delta: {
                content: words[i] + (i < words.length - 1 ? " " : "")
              }
            }
          ]
        };
        break;
      case "anthropic":
        chunk = {
          content: [
            {
              text: words[i] + (i < words.length - 1 ? " " : "")
            }
          ]
        };
        break;
      case "cohere":
        chunk = {
          text: words[i] + (i < words.length - 1 ? " " : "")
        };
        break;
      case "huggingface":
        chunk = {
          generated_text: words[i] + (i < words.length - 1 ? " " : "")
        };
        break;
      case "replicate":
        chunk = {
          output: words[i] + (i < words.length - 1 ? " " : "")
        };
        break;
      case "together":
        chunk = {
          output: {
            choices: [
              {
                text: words[i] + (i < words.length - 1 ? " " : "")
              }
            ]
          }
        };
        break;
      default: // local/ollama
        chunk = {
          response: words[i] + (i < words.length - 1 ? " " : "")
        };
        break;
    }

    sendMessage({ type: "chunk", data: chunk });

    // Add realistic delay between chunks using centralized config
    await new Promise((resolve) =>
      setTimeout(
        resolve,
        MOCK_CONFIG.MOCK_DELAY.MIN +
          Math.random() * (MOCK_CONFIG.MOCK_DELAY.MAX - MOCK_CONFIG.MOCK_DELAY.MIN)
      )
    );
  }

  // Send done message
  sendMessage({ type: "done" });
};

// Mock API call wrapper
export const callMockAPI = async (
  text: string,
  provider: string,
  isTranslation: boolean,
  sendMessage: (data: any) => void
) => {
  console.log(`Using mock response for ${provider}`);
  await generateMockStream(text, isTranslation, provider, sendMessage);
};
