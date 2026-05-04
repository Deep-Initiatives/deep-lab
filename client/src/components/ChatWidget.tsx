import { useEffect } from "react";

export function ChatWidget() {
  useEffect(() => {
    // Initialize chat-messenger SDK
    const handleChatMessengerLoaded = () => {
      if (window.chatSdk) {
        window.chatSdk.registerContext(
          window.chatSdk.prebuilts.ces.createContext({
            deploymentName:
              "projects/1074304298808/locations/us/apps/cef3629a-c361-481a-8a2f-a66d159b2913/deployments/aec9100d-1054-40eb-998e-37f9290a28cf",
            tokenBroker: {
              enableTokenBroker: true,
              enableRecaptcha: false,
            },
          })
        );
      }
    };

    // Handle bubble label visibility
    const handleBubbleInteraction = () => {
      const bubble = document.querySelector("chat-messenger-chat-bubble");

      if (!bubble) return;

      // When user clicks the bubble → hide label
      bubble.addEventListener("click", () => {
        bubble.classList.add("hide-label");
      });

      // Detect when chat closes (MutationObserver trick)
      const observer = new MutationObserver(() => {
        const isOpen = document.querySelector("chat-messenger-container");

        if (isOpen) {
          // Chat is closed → show label again
          bubble.classList.remove("hide-label");
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    };

    // Add event listeners
    window.addEventListener("chat-messenger-loaded", handleChatMessengerLoaded);
    window.addEventListener("chat-messenger-loaded", handleBubbleInteraction);

    // Cleanup listeners
    return () => {
      window.removeEventListener("chat-messenger-loaded", handleChatMessengerLoaded);
      window.removeEventListener("chat-messenger-loaded", handleBubbleInteraction);
    };
  }, []);

  return (
    <chat-messenger url-allowlist="*">
      <chat-messenger-chat-bubble
        chat-title="Deep Support"
        enable-file-upload
        enable-audio-input
      >
        <chat-reset-session-button
          slot="titlebar-actions"
          title-text="Start new chat"
        ></chat-reset-session-button>
      </chat-messenger-chat-bubble>
    </chat-messenger>
  );
}

// Add type definitions for chat-messenger custom elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "chat-messenger": ChatMessengerProps;
      "chat-messenger-chat-bubble": ChatMessengerChatBubbleProps;
      "chat-reset-session-button": ChatResetSessionButtonProps;
    }
  }

  interface Window {
    chatSdk: any;
  }
}

interface ChatMessengerProps {
  children?: React.ReactNode;
  "url-allowlist"?: string;
}

interface ChatMessengerChatBubbleProps {
  children?: React.ReactNode;
  "chat-title"?: string;
  "enable-file-upload"?: boolean;
  "enable-audio-input"?: boolean;
}

interface ChatResetSessionButtonProps {
  slot?: string;
  "title-text"?: string;
}
