import React from "react";
import ReactDOM from "react-dom";
import { Button } from "./components/ui/button";
import { TranslateIcon } from "./components/icons/translate-icon";
import "./styles/globals.css";

const TranslationIcon: React.FC = () => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed z-50 bg-white shadow-lg hover:bg-gray-100"
      onClick={() => {
        const selectedText = window.getSelection()?.toString();
        if (selectedText) {
          // TODO: Implement translation logic
          console.log("Selected text:", selectedText);
        }
      }}
    >
      <TranslateIcon />
    </Button>
  );
};

let iconContainer: HTMLDivElement | null = null;

const createIconContainer = () => {
  if (!iconContainer) {
    iconContainer = document.createElement("div");
    iconContainer.id = "translation-icon-container";
    document.body.appendChild(iconContainer);
    ReactDOM.render(<TranslationIcon />, iconContainer);
  }
};

const removeIconContainer = () => {
  if (iconContainer) {
    ReactDOM.unmountComponentAtNode(iconContainer);
    iconContainer.remove();
    iconContainer = null;
  }
};

const positionIcon = (selection: Selection) => {
  if (!iconContainer) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  iconContainer.style.position = "absolute";
  iconContainer.style.left = `${rect.right + window.scrollX + 10}px`;
  iconContainer.style.top = `${rect.top + window.scrollY - 12}px`;
  iconContainer.style.display = "block";
};

document.addEventListener("mouseup", (e) => {
  const selection = window.getSelection();

  if (selection && selection.toString().trim()) {
    createIconContainer();
    positionIcon(selection);
  } else {
    removeIconContainer();
  }
});

document.addEventListener("mousedown", (e) => {
  if (iconContainer && !iconContainer.contains(e.target as Node)) {
    removeIconContainer();
  }
});
