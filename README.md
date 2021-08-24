# 儀表板 dashboard

最初應用 `setInterval()` 方法撰寫計時器，接著延伸為馬表與倒數計時器。然後為了解決 JavaScript 單執行緒造成的無法在背景執行 `setInterval()` 問題，故又引入 `Worker()` 設計。在版面設計的部分，用 `grid` 取代 `flex` 設計 RWD 功能，令 HTML 的結構大幅簡化。引入深色主題設計，能自動檢測使用者目前主題偏好，在初次載入即直接套用。

Initially, the `setInterval()` method was used to write a timer, which was then extended to a horse watch and a countdown timer. Then we introduced the `Worker()` design to solve the problem of not being able to run `setInterval()` in the background due to the single thread of JavaScript. In the layout part, `grid` is used instead of `flex` to design the RWD function, so that the structure of HTML is greatly simplified. Introduced dark theme design, which can automatically detect user's current theme preference and apply it directly upon initial loading.

## 使用說明 Instructions

### 馬表 Stopwatch

- 使用開始(暫停) / 歸零控制馬表。
- 使用紀錄 / 清理管理馬表紀錄。
- 網頁重整可保留馬表數值，且紀錄不會丟失。
- Use Start (Pause) / Zero to control the horse table.
- Use Record/Clean to manage the horse table records.
- Web reorganization retains the horse table values and the records are not lost.

### 倒數計時器 Countdown timer

- 在設定倒數計時器欄位內填入數字。
- 自動加總時分秒，最大值為 99 時 59 分 59 秒。
- 時間到會自動無限循環撥放鈴聲，可按暫停或重設關閉。
- 網頁重整可保留倒數計時器數值。
- Enter the number in the Set Countdown Timer field.
- Automatically add the total hours, minutes and seconds, the maximum value is 99 hours, 59 minutes and 59 seconds.
- When the time is up, it will automatically loop the bell infinitely, you can press pause or reset to close.
- The webpage can be reorganized to keep the countdown timer value.

### 計時器 Timer

- 在新增計時器欄位內填入自訂名稱。
- 可同時執行多個計時器，並不衝突。
- 使用清理按鈕清除所有計時器。
- 網頁重整可保留已建立的計時器，且數值仍在。
- Fill in the new timer field with a custom name.
- Multiple timers can be run at the same time without conflict.
- Use the Clear button to clear all timers.
- Web reorganization allows you to keep the created timers with their values.
