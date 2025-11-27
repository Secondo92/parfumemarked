import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useChatThreads } from "../hooks/useChatThreads";
import type { AppOutletContext } from "../types/context";
import type { ChatThread } from "../types";
import { deleteChatThread } from "../services/chatService";

const InboxPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useOutletContext<AppOutletContext>();

  const threads = useChatThreads(userId ?? "");

  const handleDeleteThread = async (thread: ChatThread) => {
    if (
      !window.confirm(
        `Er du sikker på at du vil slette chatten om:\n\n"${thread.listingTitle}"?`
      )
    ) {
      return;
    }

    try {
      await deleteChatThread("duftbasen-default-app", thread.id);
    } catch (e) {
      console.error("Fejl ved sletning af chattråd", e);
    }
  };

  return (
    <div id="inbox-page" className="p-4 md:p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Indbakke</h2>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="border-b p-4 bg-gray-50">
          <p className="text-lg font-semibold text-gray-700">
            Dine beskedtråde ({threads.length})
          </p>
        </div>

        {threads.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {threads.map((thread) => {
              return (
                <div key={thread.id} className="flex items-center p-4">
                  ...
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Ingen aktive beskedtråde.
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;
