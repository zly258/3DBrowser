
import React, { useState, useRef } from 'react';
import { performBatchConvert } from '@zhangly1403/3dbrowser';

interface BatchConvertPageProps {
    lang: 'zh' | 'en';
    onBack: () => void;
}

const BatchConvertPage: React.FC<BatchConvertPageProps> = ({ lang, onBack }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [outputName, setOutputName] = useState(`batch_model_${new Date().getTime()}.nbim`);
    const [converting, setConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const t = {
        title: lang === 'zh' ? '批量转换 NBIM' : 'Batch Convert NBIM',
        addFiles: lang === 'zh' ? '添加文件' : 'Add Files',
        clearFiles: lang === 'zh' ? '清空列表' : 'Clear List',
        outputLabel: lang === 'zh' ? '输出文件名' : 'Output Filename',
        startConvert: lang === 'zh' ? '开始转换' : 'Start Convert',
        back: lang === 'zh' ? '返回浏览器' : 'Back to Viewer',
        progress: lang === 'zh' ? '转换进度' : 'Conversion Progress',
        ready: lang === 'zh' ? '就绪' : 'Ready',
        success: lang === 'zh' ? '转换成功！已开始下载。' : 'Conversion successful! Download started.',
        error: lang === 'zh' ? '转换失败' : 'Conversion failed',
        fileCount: lang === 'zh' ? (count: number) => `已选择 ${count} 个文件` : (count: number) => `${count} files selected`,
        dropHint: lang === 'zh' ? '点击“添加文件”或将文件拖拽至此处' : 'Click "Add Files" or drag files here'
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
        }
    };

    const startConversion = async () => {
        if (files.length === 0) return;
        
        setConverting(true);
        setProgress(0);
        
        try {
            // 这里我们需要一个简单的 t 函数来兼容库内部的翻译
            const libT = (key: string) => key; 

            await performBatchConvert({
                files,
                t: libT,
                filename: outputName,
                onProgress: (p: number, msg: string) => {
                    setProgress(p);
                    if (msg) setStatus(msg);
                },
                libPath: "./libs"
            });
            
            setStatus(t.success);
            alert(t.success);
        } catch (err) {
            console.error(err);
            setStatus(`${t.error}: ${err instanceof Error ? err.message : String(err)}`);
            alert(`${t.error}: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setConverting(false);
        }
    };

    const pageStyle: React.CSSProperties = {
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        color: '#e0e0e0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: '#2d2d2d',
        borderRadius: '8px',
        padding: '24px',
        border: '1px solid #3d3d3d',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    };

    const buttonStyle = (primary = false): React.CSSProperties => ({
        padding: '10px 20px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: primary ? '#007acc' : '#444',
        color: '#fff',
        cursor: converting ? 'not-allowed' : 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'all 0.2s',
        opacity: converting && primary ? 0.7 : 1
    });

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '4px',
        border: '1px solid #444',
        backgroundColor: '#1e1e1e',
        color: '#fff',
        fontSize: '14px',
        marginTop: '8px',
        outline: 'none'
    };

    const dropZoneStyle: React.CSSProperties = {
        border: '2px dashed #444',
        borderRadius: '8px',
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#252525',
        cursor: 'pointer',
        transition: 'border-color 0.2s'
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <div 
                    style={dropZoneStyle}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div style={{ color: '#888' }}>{t.dropHint}</div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        multiple 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange}
                    />
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '14px', color: '#aaa' }}>
                        {t.fileCount(files.length)}
                    </div>
                    {files.length > 0 && (
                        <button 
                            style={{ ...buttonStyle(), backgroundColor: 'transparent', color: '#ff4d4f', padding: '4px 8px' }}
                            onClick={() => setFiles([])}
                        >
                            {t.clearFiles}
                        </button>
                    )}
                </div>

                {files.length > 0 && (
                    <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '12px', padding: '8px', backgroundColor: '#1e1e1e', borderRadius: '4px' }}>
                        {files.map((f, i) => (
                            <div key={i} style={{ fontSize: '12px', padding: '4px 0', borderBottom: '1px solid #2d2d2d', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                                <span style={{ color: '#666', marginLeft: '10px' }}>{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={cardStyle}>
                <label style={{ fontSize: '14px', color: '#aaa' }}>
                    {t.outputLabel}
                    <input 
                        style={inputStyle}
                        value={outputName}
                        onChange={(e) => setOutputName(e.target.value)}
                        placeholder="example.nbim"
                    />
                </label>

                <div style={{ marginTop: '24px' }}>
                    <button 
                        style={{ ...buttonStyle(true), width: '100%' }}
                        onClick={startConversion}
                        disabled={converting || files.length === 0}
                    >
                        {converting ? `${status} (${progress}%)` : t.startConvert}
                    </button>
                </div>

                {converting && (
                    <div style={{ marginTop: '16px' }}>
                        <div style={{ height: '4px', width: '100%', backgroundColor: '#1e1e1e', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#007acc', transition: 'width 0.3s' }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BatchConvertPage;
