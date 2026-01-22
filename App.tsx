
import React, { useState } from 'react';
import { ThreeViewer } from '@zhangly1403/3dbrowser';
import BatchConvertPage from './BatchConvertPage';

const App: React.FC = () => {
    const [lang, setLang] = useState<'zh' | 'en'>('zh');
    const [currentPage, setCurrentPage] = useState<'viewer' | 'batch'>('viewer');

    const t = {
        title: lang === 'zh' ? '3D 浏览器' : '3D Browser',
        langZh: '中文',
        langEn: 'English',
        hint: lang === 'zh' ? '支持拖拽本地文件至浏览器' : 'Drag local files to browser',
        batchMenu: lang === 'zh' ? '批量转换' : 'Batch Convert',
        viewerMenu: lang === 'zh' ? '模型查看' : 'Model Viewer'
    };

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#1e1e1e',
        color: '#fff'
    };

    const headerStyle: React.CSSProperties = {
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2d2d2d',
        borderBottom: '1px solid #3d3d3d',
        zIndex: 1000,
        padding: '0 20px'
    };

    const buttonStyle = (active: boolean): React.CSSProperties => ({
        padding: '6px 16px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: active ? '#007acc' : '#3d3d3d',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: active ? 'bold' : 'normal',
        transition: 'background-color 0.2s'
    });

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#007acc', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span>{t.title}</span>
                    <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
                        <button 
                            style={buttonStyle(currentPage === 'viewer')} 
                            onClick={() => setCurrentPage('viewer')}
                        >
                            {t.viewerMenu}
                        </button>
                        <button 
                            style={buttonStyle(currentPage === 'batch')} 
                            onClick={() => setCurrentPage('batch')}
                        >
                            {t.batchMenu}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {currentPage === 'viewer' && (
                        <div style={{ fontSize: '12px', color: '#888' }}>
                            {t.hint}
                        </div>
                    )}
                    <div style={{ display: 'flex', backgroundColor: '#1e1e1e', borderRadius: '6px', padding: '3px', gap: '2px' }}>
                        <button 
                            style={buttonStyle(lang === 'zh')} 
                            onClick={() => setLang('zh')}
                        >
                            {t.langZh}
                        </button>
                        <button 
                            style={buttonStyle(lang === 'en')} 
                            onClick={() => setLang('en')}
                        >
                            {t.langEn}
                        </button>
                    </div>
                </div>
            </div>
            
            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {currentPage === 'viewer' ? (
                    <ThreeViewer 
                        allowDragOpen={true}
                        libPath="./libs"
                        showStats={true}
                        defaultLang={lang}
                    />
                ) : (
                    <BatchConvertPage 
                        lang={lang} 
                        onBack={() => setCurrentPage('viewer')} 
                    />
                )}
            </div>
        </div>
    );
};

export default App;
