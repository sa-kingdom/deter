<template>
  <div class="ts-app-layout is-full is-horizontal">
    <div class="cell has-dark" style="width: 240px; color: var(--ts-white)">
      <div class="ts-content is-center-aligned">
        <div class="ts-wrap is-vertical is-compact is-middle-aligned">
          <div class="ts-image is-tiny is-circular">
            <img src="https://v4.tocas-ui.com/zh-tw/assets/images/user.png" />
          </div>
          <div class="ts-header">Dragon</div>
        </div>
      </div>
      <div class="ts-divider"></div>
      <div class="ts-content is-dense">
        <div class="ts-grid">
          <div class="column is-fluid">
            <div class="ts-text is-bold">使用者管理</div>
          </div>
          <div class="column">
            <span class="ts-icon is-users-icon"></span>
          </div>
        </div>
      </div>
      <div class="ts-menu is-dense is-small" style="opacity: 0.8">
        <a href="#!" class="item">搜尋</a>
        <a href="#!" class="item">新增</a>
        <a href="#!" class="item">移除</a>
      </div>
      <div class="ts-divider has-top-spaced-small"></div>
      <div class="ts-content is-dense">
        <div class="ts-grid">
          <div class="column is-fluid">
            <div class="ts-text is-bold">網站管理</div>
          </div>
          <div class="column">
            <span class="ts-icon is-cogs-icon"></span>
          </div>
        </div>
      </div>
      <div class="ts-menu is-dense is-small" style="opacity: 0.8">
        <a href="#!" class="item">偏好設定</a>
        <a href="#!" class="item">系統最佳化</a>
        <a href="#!" class="item">安全防護</a>
      </div>
      <div class="ts-divider has-top-spaced-small"></div>
      <a href="#!" class="ts-content is-interactive is-dense">
        <div class="ts-grid">
          <div class="column is-fluid">
            <div class="ts-text is-bold">管理文章</div>
          </div>
          <div class="column">
            <span class="ts-icon is-newspaper-icon"></span>
          </div>
        </div>
      </a>
      <div class="ts-divider"></div>
      <a href="#!" class="ts-content is-interactive is-dense">
        <div class="ts-grid">
          <div class="column is-fluid">
            <div class="ts-text is-bold">回報處理</div>
          </div>
          <div class="column">
            <span class="ts-icon is-flag-icon"></span>
          </div>
        </div>
      </a>
    </div>
    <div class="cell is-fluid is-secondary">
      <div class="ts-container is-narrow has-vertically-padded-large">
        <div class="ts-header is-large is-heavy">儀表板</div>
        <div class="ts-text is-secondary">從這裡快速檢視您的網站狀態。</div>
        <div class="ts-grid is-relaxed is-3-columns has-top-spaced-large">
          <div class="column">
            <div class="ts-box">
              <div class="ts-content">
                <div class="ts-statistic">
                  <div class="value">42,689</div>
                  <div class="comparison is-increased">32</div>
                </div>
                本月拜訪次數
              </div>
              <div class="symbol">
                <span class="ts-icon is-eye-icon"></span>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="ts-box">
              <div class="ts-content">
                <div class="ts-statistic">
                  <div class="value">8,652</div>
                  <div class="comparison is-increased">351</div>
                </div>
                總會員數
              </div>
              <div class="symbol">
                <span class="ts-icon is-users-icon"></span>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="ts-box">
              <div class="ts-content">
                <div class="ts-statistic">
                  <div class="value">3</div>
                  <div class="comparison is-decreased">14</div>
                </div>
                平均在線分鐘數
              </div>
              <div class="symbol">
                <span class="ts-icon is-clock-icon"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="ts-divider is-section has-top-spaced-large"></div>
        <div class="ts-grid is-relaxed has-top-spaced-large">
          <div class="column is-10-wide">
            <div class="ts-box is-top-indicated">
              <div class="ts-content is-dense">
                <div class="ts-header is-heavy">會員清單</div>
              </div>
              <div class="ts-divider"></div>
              <table class="ts-table is-basic">
                <thead>
                  <tr>
                    <th>使用者名稱</th>
                    <th>電子郵件信箱</th>
                    <th>啟用日期</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="is-disabled">
                    <td>yamiodymel</td>
                    <td><a href="/cdn-cgi/l/email-protection" class="__cf_email__"
                        data-cfemail="9ce5fdf1f5f3f8e5f1f9f0dcf9e4fdf1ecf0f9b2fff3f1">[email&#160;protected]</a></td>
                    <td>2013/09/14</td>
                  </tr>
                  <tr>
                    <td>karisu</td>
                    <td><a href="/cdn-cgi/l/email-protection" class="__cf_email__"
                        data-cfemail="b0c3c5c0d5c2dbd1c2d9808087f0d5c8d1ddc0dcd59ed3dfdd">[email&#160;protected]</a></td>
                    <td>2020/11/03</td>
                  </tr>
                  <tr>
                    <td class="is-disabled">shiroteacat</td>
                    <td><a href="/cdn-cgi/l/email-protection" class="__cf_email__"
                        data-cfemail="94e7fcfde6fbe0f1f5f7f5e0d4f1ecf5f9e4f8f1baf7fbf9">[email&#160;protected]</a></td>
                    <td>2009/07/15</td>
                  </tr>
                </tbody>
              </table>
              <div class="ts-divider"></div>
              <div class="ts-content">
                <div class="ts-pagination">
                  <a class="item is-back"></a>
                  <a class="item">1</a>
                  <a class="item is-active">2</a>
                  <a class="item">3</a>
                  <a class="item">4</a>
                  <a class="item is-next"></a>
                </div>
              </div>
            </div>
            <div class="ts-box is-top-indicated has-top-spaced-big">
              <div class="ts-content is-dense">
                <div class="ts-header is-heavy">留言板</div>
              </div>
              <div class="ts-divider"></div>
              <div class="ts-content">
                <div class="ts-conversation">
                  <div class="avatar">
                    <img src="https://v4.tocas-ui.com/zh-tw/assets/images/user.png" />
                  </div>
                  <div class="content">
                    <div class="bubble">
                      <div class="text">
                        不要到處亂刪使用者的留言，<br />
                        你是組刻薄嗎 🥲
                      </div>
                      <div class="meta">
                        <div class="item">下午 11:58</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ts-conversation is-self">
                  <div class="avatar">
                    <img src="https://v4.tocas-ui.com/zh-tw/assets/images/user.png" />
                  </div>
                  <div class="content">
                    <div class="bubble">
                      <div class="text">好喔 👀👌</div>
                      <div class="meta">
                        <div class="item">下午 11:59</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="ts-divider"></div>
              <div class="ts-content">
                <div class="ts-input">
                  <textarea placeholder="輸入訊息…"></textarea>
                </div>
                <div class="ts-grid is-compact has-top-spaced">
                  <div class="column">
                    <div class="ts-wrap is-compact">
                      <div class="ts-chip is-circular">早安！</div>
                      <div class="ts-chip is-circular">知道了。</div>
                    </div>
                  </div>
                  <div class="column is-fluid is-end-aligned">
                    <button class="ts-button">送出</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column is-6-wide">
            <div class="ts-box is-top-indicated">
              <div class="ts-content is-dense">
                <div class="ts-header is-heavy">系統概況</div>
              </div>
              <div class="ts-divider"></div>
              <div class="ts-content">
                <div class="ts-text is-bold">剩餘空間</div>
                <div class="ts-progress is-small has-top-spaced-small">
                  <div class="bar" style="width: 50%">
                    <div class="text">64 GB</div>
                  </div>
                </div>
                <div class="ts-text is-bold has-top-spaced-small">可用記憶體</div>
                <div class="ts-progress is-small has-top-spaced-small">
                  <div class="bar" style="width: 80%">
                    <div class="text">4 GB</div>
                  </div>
                </div>
                <div class="ts-text is-bold has-top-spaced-small">系統負載</div>
                <div class="ts-progress is-small has-top-spaced-small">
                  <div class="bar" style="width: 30%">
                    <div class="text">30%</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="ts-box is-collapsed is-top-indicated has-top-spaced-big">
              <div class="ts-content is-dense">
                <div class="ts-header is-heavy">其他功能</div>
              </div>
              <div class="ts-divider"></div>
              <div class="ts-menu is-collapsed">
                <a class="item">
                  <div class="ts-iconset is-outlined">
                    <span class="ts-icon is-bullhorn-icon"></span>
                    <div class="content">
                      <div class="title">發送公告</div>
                      <div class="text">傳送一個所有人都可見的訊息。</div>
                    </div>
                  </div>
                </a>
                <div class="ts-divider"></div>
                <a class="item">
                  <div class="ts-iconset is-outlined">
                    <span class="ts-icon is-ticket-icon"></span>
                    <div class="content">
                      <div class="title">建立優惠券</div>
                      <div class="text">向目前登入的使用者發送折價優惠代碼。</div>
                    </div>
                  </div>
                </a>
                <div class="ts-divider"></div>
                <a class="item">
                  <div class="ts-iconset is-outlined">
                    <span class="ts-icon is-hand-icon"></span>
                    <div class="content">
                      <div class="title">強制停機</div>
                      <div class="text">讓網站進入關機程序並逐一踢出已登入的使用者。</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
