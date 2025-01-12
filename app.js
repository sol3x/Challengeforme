const { useState, useEffect } = React;
const { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } = Recharts;

const PushupChallenge = () => {
  // خواندن داده‌های ذخیره شده از localStorage
  const loadFromStorage = () => {
    try {
      const savedData = localStorage.getItem('pushupChallenge');
      if (savedData) {
        const { currentDay, completed } = JSON.parse(savedData);
        return { currentDay, completed };
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    return { currentDay: 1, completed: [] };
  };

  const [currentDay, setCurrentDay] = useState(loadFromStorage().currentDay);
  const [completed, setCompleted] = useState(loadFromStorage().completed);

  // ذخیره تغییرات در localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pushupChallenge', JSON.stringify({ currentDay, completed }));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [currentDay, completed]);

  const currentStage = Math.ceil(currentDay / 10);
  const dailyPushups = currentStage;
  
  const totalPushups = completed.reduce((sum, day) => {
    const stage = Math.ceil(day / 10);
    return sum + stage;
  }, 0);

  // محاسبه داده‌های نمودار
  const chartData = completed.slice(-30).map(day => ({
    day: day,
    pushups: Math.ceil(day / 10)
  }));

  // محاسبه دستاوردها
  const achievements = [
    { id: 1, title: "۱۰۰ شنا", threshold: 100, icon: "🎯", unlocked: totalPushups >= 100 },
    { id: 2, title: "۵۰۰ شنا", threshold: 500, icon: "💪", unlocked: totalPushups >= 500 },
    { id: 3, title: "۱۰۰۰ شنا", threshold: 1000, icon: "🏆", unlocked: totalPushups >= 1000 },
    { id: 4, title: "۱۰ روز متوالی", threshold: 10, icon: "🔥", unlocked: completed.length >= 10 },
  ];

  const handleComplete = () => {
    if (!completed.includes(currentDay)) {
      setCompleted([...completed, currentDay]);
      setCurrentDay(currentDay + 1);
    }
  };

  const handleUndo = () => {
    if (completed.length > 0) {
      const newCompleted = completed.filter(day => day !== currentDay - 1);
      setCompleted(newCompleted);
      setCurrentDay(currentDay - 1);
    }
  };

  return React.createElement(
    'div',
    { className: 'max-w-4xl mx-auto p-4 space-y-6' },
    // کارت اصلی
    React.createElement(
      'div',
      { className: 'bg-white rounded-lg shadow-lg p-6' },
      React.createElement('h1', { className: 'text-2xl font-bold text-center mb-6' }, 'چالش شنا تا ۱۰۰'),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-6' },
        // مرحله فعلی
        React.createElement(
          'div',
          { className: 'bg-blue-50 p-4 rounded-lg' },
          React.createElement('div', { className: 'text-lg font-semibold' }, 'مرحله فعلی'),
          React.createElement('div', { className: 'text-3xl font-bold text-blue-600' }, currentStage)
        ),
        // شنای امروز
        React.createElement(
          'div',
          { className: 'bg-green-50 p-4 rounded-lg' },
          React.createElement('div', { className: 'text-lg font-semibold' }, 'شنای امروز'),
          React.createElement('div', { className: 'text-3xl font-bold text-green-600' }, dailyPushups)
        ),
        // مجموع شناها
        React.createElement(
          'div',
          { className: 'bg-purple-50 p-4 rounded-lg' },
          React.createElement('div', { className: 'text-lg font-semibold' }, 'مجموع شناها'),
          React.createElement('div', { className: 'text-3xl font-bold text-purple-600' }, totalPushups)
        )
      ),
      // دکمه‌ها
      React.createElement(
        'div',
        { className: 'flex justify-center space-x-4' },
        React.createElement(
          'button',
          {
            onClick: handleComplete,
            className: `px-4 py-2 rounded-lg ${
              completed.includes(currentDay)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`,
            disabled: completed.includes(currentDay)
          },
          'تکمیل امروز'
        ),
        React.createElement(
          'button',
          {
            onClick: handleUndo,
            className: `px-4 py-2 rounded-lg border ${
              completed.length === 0
                ? 'bg-gray-100 cursor-not-allowed'
                : 'hover:bg-gray-100'
            }`,
            disabled: completed.length === 0
          },
          'لغو آخرین'
        )
      )
    ),
    // نمودار
    React.createElement(
      'div',
      { className: 'bg-white rounded-lg shadow-lg p-6' },
      React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'نمودار پیشرفت'),
      React.createElement(
        'div',
        { className: 'h-64' },
        React.createElement(
          ResponsiveContainer,
          { width: '100%', height: '100%' },
          React.createElement(
            LineChart,
            { data: chartData },
            React.createElement(XAxis, { dataKey: 'day' }),
            React.createElement(YAxis),
            React.createElement(Tooltip),
            React.createElement(Line, { type: 'monotone', dataKey: 'pushups', stroke: '#8884d8' })
          )
        )
      )
    ),
    // دستاوردها
    React.createElement(
      'div',
      { className: 'bg-white rounded-lg shadow-lg p-6' },
      React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'دستاوردها'),
      React.createElement(
        'div',
        { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
        achievements.map(achievement =>
          React.createElement(
            'div',
            {
              key: achievement.id,
              className: `p-4 rounded-lg border text-center ${
                achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50'
              }`
            },
            React.createElement('div', { className: 'text-2xl mb-2' }, achievement.icon),
            React.createElement('div', { className: 'font-semibold' }, achievement.title),
            React.createElement(
              'div',
              { className: 'text-sm text-gray-600' },
              achievement.unlocked ? 'انجام شد!' : 'قفل شده'
            )
          )
        )
      )
    ),
    // تاریخچه
    React.createElement(
      'div',
      { className: 'bg-white rounded-lg shadow-lg p-6' },
      React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'تاریخچه ۱۰ روز اخیر'),
      React.createElement(
        'div',
        { className: 'grid grid-cols-5 md:grid-cols-10 gap-2' },
        Array.from({ length: 10 }, (_, i) => currentDay - 9 + i).map(day =>
          React.createElement(
            'div',
            {
              key: day,
              className: `aspect-square flex items-center justify-center text-sm border rounded-md ${
                completed.includes(day) ? 'bg-green-500 text-white' : 'bg-gray-100'
              }`
            },
            day
          )
        )
      )
    )
  );
};

// رندر کردن برنامه
ReactDOM.render(
  React.createElement(PushupChallenge),
  document.getElementById('root')
);