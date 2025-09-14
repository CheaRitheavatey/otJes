import React, { useState } from 'react';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export const APIKeySettings = ({ apiKeys, onUpdateApiKeys, isInitialized }) => {
  const [showKeys, setShowKeys] = useState({
    huggingFace: false,
    seaLion: false
  });
  const [tempKeys, setTempKeys] = useState(apiKeys);

  const handleKeyChange = (service, value) => {
    setTempKeys(prev => ({
      ...prev,
      [service]: value
    }));
  };

  const handleSaveKeys = () => {
    onUpdateApiKeys(tempKeys);
  };

  const toggleShowKey = (service) => {
    setShowKeys(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const maskKey = (key) => {
    if (!key) return '';
    return key.substring(0, 8) + '•'.repeat(Math.max(0, key.length - 8));
  };

  return (
    <div className="api-key-settings">
      <div className="panel-header">
        <div className="panel-title">
          <Key className="panel-icon" size={20} />
          <h3>AI Service Configuration</h3>
        </div>
        <div className="status-indicator">
          {isInitialized ? (
            <CheckCircle size={16} className="status-success" />
          ) : (
            <AlertCircle size={16} className="status-warning" />
          )}
          <span className="status-text">
            {isInitialized ? 'Connected' : 'Not Connected'}
          </span>
        </div>
      </div>

      <div className="api-key-content">
        {/* Hugging Face API Key */}
        <div className="key-group">
          <label className="key-label">
            <span>Hugging Face API Key</span>
            <a 
              href="https://huggingface.co/settings/tokens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="key-link"
            >
              Get API Key
            </a>
          </label>
          <div className="key-input-group">
            <input
              type={showKeys.huggingFace ? 'text' : 'password'}
              value={tempKeys.huggingFace}
              onChange={(e) => handleKeyChange('huggingFace', e.target.value)}
              placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="key-input"
            />
            <button
              type="button"
              onClick={() => toggleShowKey('huggingFace')}
              className="key-toggle"
            >
              {showKeys.huggingFace ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {apiKeys.huggingFace && (
            <div className="key-status">
              <CheckCircle size={14} className="status-icon-success" />
              <span>Key saved: {maskKey(apiKeys.huggingFace)}</span>
            </div>
          )}
        </div>

        {/* Sea Lion AI API Key */}
        <div className="key-group">
          <label className="key-label">
            <span>Sea Lion AI API Key</span>
            <a 
              href="https://aisingapore.org/sea-lion/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="key-link"
            >
              Get API Key
            </a>
          </label>
          <div className="key-input-group">
            <input
              type={showKeys.seaLion ? 'text' : 'password'}
              value={tempKeys.seaLion}
              onChange={(e) => handleKeyChange('seaLion', e.target.value)}
              placeholder="sl_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="key-input"
            />
            <button
              type="button"
              onClick={() => toggleShowKey('seaLion')}
              className="key-toggle"
            >
              {showKeys.seaLion ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {apiKeys.seaLion && (
            <div className="key-status">
              <CheckCircle size={14} className="status-icon-success" />
              <span>Key saved: {maskKey(apiKeys.seaLion)}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleSaveKeys}
          className="save-keys-btn"
          disabled={!tempKeys.huggingFace || !tempKeys.seaLion}
        >
          Save API Keys
        </button>

        <div className="api-info">
          <h4>Service Information</h4>
          <ul>
            <li><strong>Hugging Face:</strong> Provides image classification for sign language detection</li>
            <li><strong>Sea Lion AI:</strong> Converts detected signs into fluent, natural sentences</li>
            <li><strong>Rate Limits:</strong> Processing limited to 2 requests per second to avoid API limits</li>
          </ul>
        </div>
      </div>
    </div>
  );
};