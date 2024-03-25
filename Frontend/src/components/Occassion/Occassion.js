import React from "react";
import { DeepChat } from "deep-chat-react";
import "./occassion.css"; // Import the CSS file

const Occasion = () => {
  return (
    <div className="occasion-container">
      <h1 className="occasion-header">Outfit Suggestions</h1>
      <div className="deep-chat-container">
        <DeepChat
          directConnection={{
            openAI: {
              key: #OPENAI_API_KEY, /*Paste your OPENAI API KEY HERE */
              chat: {
                max_tokens: 500,
                system_prompt: "Assist me with anything you can"
              }
            } 
          }}
          style={{ borderRadius: '8px' }}
        />
      </div>
    </div>
  );
};

export default Occasion;
