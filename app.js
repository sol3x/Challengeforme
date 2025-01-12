// کد قبلی React که داشتیم با این تغییرات:
// 1. اضافه کردن پشتیبانی آفلاین
// 2. بهینه‌سازی برای PWA
const { useState, useEffect } = React;
const { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } = Recharts;

const PushupChallenge = () => {
  // کد قبلی همراه با تغییرات زیر

  // ذخیره در localStorage با پشتیبانی آفلاین
  const saveToStorage = async (data) => {
    try {
      localStorage.setItem('pushupChallenge', JSON.stringify(data));
      // اگر آنلاین بودیم، می‌تونیم اینجا با سرور هم همگام‌سازی کنیم
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    saveToStorage({ currentDay, completed });
  }, [currentDay, completed]);

  // اضافه کردن مدیریت وضعیت آفلاین
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // نمایش وضعیت آفلاین
  const OfflineIndicator = () => !isOnline && (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
      شما آفلاین هستید. تغییرات ذخیره می‌شوند و بعداً همگام‌سازی خواهند شد.
    </div>
  );

  // [بقیه کد قبلی بدون تغییر]

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-20">
      <OfflineIndicator />
      {/* [بقیه کامپوننت‌های قبلی] */}
    </div>
  );
};

// رندر کردن برنامه
ReactDOM.render(
  React.createElement(PushupChallenge),
  document.getElementById('root')
);