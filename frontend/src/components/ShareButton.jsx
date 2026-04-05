import React, { useState } from 'react';
import { Share2, Copy, Check, Printer, Flame, MessageCircle } from 'lucide-react';

const ShareButton = ({ recipe }) => {
    const [showShareModal, setShowShareModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const recipeUrl = `${window.location.origin}/recipe/${recipe._id}`;
    const recipeTitle = recipe.title;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(recipeUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const shareToTwitter = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(recipeTitle)}&url=${encodeURIComponent(recipeUrl)}`;
        window.open(url, '_blank');
    };

    const shareToFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(recipeUrl)}`;
        window.open(url, '_blank');
    };

    const shareToWhatsApp = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(`${recipeTitle} - ${recipeUrl}`)}`;
        window.open(url, '_blank');
    };

    return (
        <>
            <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md"
            >
                <Share2 size={18} />
                Share
            </button>

            {showShareModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowShareModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Share Recipe</h3>
                            <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600">
                                <Share2 size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleCopyLink}
                                className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} className="text-gray-600" />}
                                <span className="font-medium text-gray-700">{copied ? 'Copied!' : 'Copy Link'}</span>
                            </button>

                            <button
                                onClick={handlePrint}
                                className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <Printer size={20} className="text-gray-600" />
                                <span className="font-medium text-gray-700">Print Recipe</span>
                            </button>

                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-sm text-gray-500 mb-3">Share on social media</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={shareToTwitter}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-black hover:bg-gray-800 text-white rounded-xl transition-colors"
                                    >
                                        <Flame size={20} />
                                        <span className="font-medium">Twitter</span>
                                    </button>
                                    <button
                                        onClick={shareToFacebook}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                                    >
                                        <MessageCircle size={20} />
                                        <span className="font-medium">Facebook</span>
                                    </button>
                                    <button
                                        onClick={shareToWhatsApp}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
                                    >
                                        <Flame size={20} />
                                        <span className="font-medium">WhatsApp</span>
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-sm text-gray-500 mb-2">Recipe Link</p>
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                                    <Copy size={16} className="text-gray-400" />
                                    <span className="text-xs text-gray-600 truncate flex-grow">{recipeUrl}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ShareButton;
