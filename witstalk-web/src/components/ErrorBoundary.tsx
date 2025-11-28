import { useNavigate } from 'react-router';
import { Button, Card, Typography, Divider } from 'antd';
import { ReloadOutlined, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Paragraph, Text } = Typography;

// 定义错误边界组件的属性类型
interface ErrorBoundaryProps {
  error: unknown;
}

/**
 * 错误边界组件，用于显示路由级别的错误
 */
export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  let stack: string | undefined = undefined;

  let message = '出错了！';
  let errorType = '未知错误';
  let details = '';
  
  // 错误处理逻辑
  if (typeof error === 'object' && error !== null && 'status' in error) {
    // 路由错误处理
    const routeError = error as { status: number; statusText?: string };
    errorType = '路由错误';
    message = routeError.status === 404 ? '404 - 页面未找到' : `${routeError.status} - 服务器错误`;
    details = routeError.status === 404 
      ? '抱歉，您请求的页面不存在或已被删除。' 
      : routeError.statusText || '服务器暂时无法处理您的请求。';
  } else if (error instanceof Error) {
    // JavaScript错误处理
    errorType = error.name || '应用错误';
    message = '应用发生错误';
    details = process.env.NODE_ENV === 'development' ? error.message : '应用在运行时出现了问题。';
    stack = error.stack;
  } else if (typeof error === 'string') {
    // 字符串错误处理
    errorType = '文本错误';
    message = '发生了错误';
    details = process.env.NODE_ENV === 'development' ? error : '系统遇到了未知问题。';
  }

  // 重试功能
  const handleRetry = (): void => {
    window.location.reload();
  };

  // 返回首页
  const handleGoHome = (): void => {
    navigate('/');
  };

  // 切换详情显示
  const toggleDetails = (): void => {
    setShowDetails(!showDetails);
  };

  return (
        <div className="cream-bg">
            <div>
                <Card className="cream-card cream-fade-in max-w-md mx-auto">
                    <div className="cream-header">
                        {/* 错误图标 - 奶油风配色 */}
                        <InfoCircleOutlined style={{ fontSize: '48px', color: '#a67c41', marginBottom: '24px', display: 'block' }} />
                        
                        {/* 错误标题 - 奶油风配色 */}
                        <Title level={3} className="cream-title">
                            {message}
                        </Title>
                        
                        {/* 错误描述 */}
                        <Paragraph className="cream-subtitle">
                            {details}
                        </Paragraph>
                        
                        <Divider className="my-6" />
                        
                        {/* 操作按钮 - 奶油风样式 */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button 
                                type="primary" 
                                icon={<ReloadOutlined />}
                                onClick={handleRetry}
                                className="cream-button"
                            >
                                重试
                            </Button>
                            <Button 
                                icon={<HomeOutlined />}
                                onClick={handleGoHome}
                                style={{ 
                                    backgroundColor: 'transparent', 
                                    color: '#a67c41',
                                    borderColor: '#e9d5b3',
                                    borderRadius: '12px',
                                    height: '40px'
                                }}
                            >
                                返回首页
                            </Button>
                        </div>
                        
                        {/* 开发环境下的错误详情 - 奶油风样式 */}
                        {process.env.NODE_ENV === 'development' && (stack || errorType !== '未知错误') && (
                            <div className="mt-8">
                                <Button 
                                    type="link" 
                                    onClick={toggleDetails}
                                    className="cream-link"
                                >
                                    {showDetails ? '隐藏错误详情' : '显示错误详情'}
                                </Button>
                                
                                {showDetails && (
                                    <div className="cream-box mt-4">
                                        <div className="mb-3">
                                            <Text strong className="text-[#8b6914]">错误类型：</Text>
                                            <Text className="text-[#666]">{errorType}</Text>
                                        </div>
                                        {stack && (
                                            <div className="mt-3">
                                                <Text strong className="text-[#8b6914]">错误堆栈：</Text>
                                                <pre className="mt-2 p-3 bg-[#fff8e8] text-[#666] text-xs overflow-auto max-h-40 rounded-lg border border-[#e9d5b3]">
                                                    {stack}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
          </div>
        </Card>
      </div>
    </div>
  );
}
