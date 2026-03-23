export const HelloWorkGet = async (page) => {
  try {
    const scrapeHelloWork = async (): Promise<any> => {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.evaluate(() => {
          const btn = document.getElementById('ID_yukoKyujinBtn') as HTMLAnchorElement
          if (!btn) throw new Error('ボタンが見つかりません')
          btn.click()
        })
      ])

      const allJobs: any[] = []

      while (true) {
        const jobsOnPage = await page.evaluate(() => {
          const jobs: any[] = []

          const tables = document.querySelectorAll('table.kyujin')

          tables.forEach((table) => {
            const job: any = {}

            // 職種
            job.職種 =
              table
                .querySelector('.kyujin_head strong')
                ?.parentElement?.nextElementSibling?.textContent?.trim() ?? ''

            job.status = table.querySelector('.nes_label.nes')?.textContent?.trim() ?? ''

            // 受付年月日・紹介期限日
            const dateRow = Array.from(table.querySelectorAll('tr')).find((tr) =>
              tr.textContent?.includes('受付年月日')
            )
            const dateDivs = dateRow?.querySelectorAll('div') ?? []
            job.受付年月日 = dateDivs[1]?.textContent?.trim() ?? ''
            job.紹介期限日 = dateDivs[2]?.textContent?.trim() ?? ''

            const leftTds = table.querySelectorAll('.left-side table tr')
            leftTds.forEach((tr) => {
              const label = tr.querySelector('td:nth-child(1)')?.textContent?.trim()
              const td = tr.querySelector('td:nth-child(2)')
              const value = (td as HTMLElement)?.innerText?.replace(/\s+/g, ' ').trim()
              if (label) job[label] = value
            })
            // 右テーブル項目（同上）
            const rightTds = table.querySelectorAll('.right-side table tr')
            rightTds.forEach((tr) => {
              const label = tr.querySelector('td:nth-child(1)')?.textContent?.trim()
              const td = tr.querySelector('td:nth-child(2)')
              const value = (td as HTMLElement)?.innerText?.replace(/\s+/g, ' ').trim()
              if (label) job[label] = value
            })

            // こだわり条件
            job.こだわり条件 = Array.from(
              table.querySelectorAll('.kodawari span.nes_label.any')
            ).map((span) => span.textContent?.trim())

            // 求人票URL
            job.求人票URL = table.querySelector('#ID_kyujinhyoBtn')?.getAttribute('href') ?? ''

            // 求人数
            job.求人数 =
              table
                .querySelector('tr:last-of-type')
                ?.textContent?.match(/求人数：(.+?)名/)?.[1]
                ?.trim() ?? ''

            job.detailUrl = table.querySelector('#ID_dispDetailBtn')?.getAttribute('href') ?? ''

            jobs.push(job)
          })
          return jobs
        })

        allJobs.push(...jobsOnPage)
        const nextButton = await page.$('input[name="fwListNaviBtnNext"]')
        if (!nextButton) {
          break
        }
        const isDisabled = await nextButton.evaluate((btn: HTMLInputElement) => btn.disabled)
        if (isDisabled) {
          break
        }
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
          nextButton.click()
        ])
      }
      const filterd = allJobs.filter((item) => item.status !== '非公開')

      const jushos: string[] = []

      for (const item of filterd) {
        // detailUrl は e.g. "./GEAB100020.do?…” のような相対パス
        const url = new URL(item.detailUrl, page.url()).toString()

        try {
          // 詳細ページへ移動
          await page.goto(url, { waitUntil: 'domcontentloaded' })
        } catch (err) {
          //console.warn(`詳細ページへ移動失敗: ${url}`, err);
          jushos.push('')
          continue
        }

        let address = ''
        try {
          // 要素取得。見つからなければ null が返る
          const cell = await page.$('div[name="shgBsJusho"]')
          const cellSub = await page.$('div[name="gsShgBsJusho"]')
          if (cell && !cellSub) {
            address = (await page.evaluate((el) => el.textContent, cell))?.trim() ?? ''
          } else if (cellSub && !cell) {
            address = (await page.evaluate((el) => el.textContent, cellSub))?.trim() ?? ''
          } else {
            //console.info(`住所セルなし: ${url}`);
            address = ''
          }
        } catch (err) {
          //console.error(`住所取得中にエラー: ${url}`, err);
          address = ''
        }
        const pushdata = item
        pushdata.address = address

        jushos.push(pushdata)

        // 一覧ページに戻る
        try {
          await page.goBack({ waitUntil: 'networkidle2' })
        } catch (err) {
          console.warn('一覧ページに戻れませんでした:', err)
          // 必要なら再度一覧URLへ飛ばすか break する
        }
      }

      return [filterd, jushos]
    }
    try {
      const result = await scrapeHelloWork()
      return result
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      const linkLocator = page.locator('a[href*="GEAB100010.do"]')
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        linkLocator.click()
      ])
    }
  } catch (e) {
    console.error('ハロワ取得エラー:', e)
    throw e
  }
}

export const HelloWorkPdfGet = async (
  lists,
  HelloWorkWindow,
  page,
  path,
  fs,
  browser,
  downloadDir
) => {
  const total = lists.length
  let count = 0
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true })
  }

  for (const item of lists) {
    const afterNewline = item.address
      .split(/\r?\n/)
      .filter((line) => line.trim() !== '')
      .pop()!
      .trim()
    const filename = `${afterNewline}_${item.求人区分}_${item.職種}`
    try {
      count = count + 1
      const finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
      const downloadsPath = path.join(downloadDir, finalFilename)
      const jobUrl = `https://kyujin.hellowork.mhlw.go.jp/kyujin/${item.求人票URL}`

      try {
        await page.goto(jobUrl, { waitUntil: 'domcontentloaded' })
        const cookies = await page.cookies()
        const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ')
        browser = null

        const res = await fetch(jobUrl, {
          headers: { Cookie: cookieHeader }
        })
        if (!res.ok) {
          throw new Error(`HTTP エラー ${res.status} ${res.statusText}`)
        }
        const arrayBuffer = await res.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        if (buffer.length < 10000) {
          throw new Error(`取得データが小さすぎます (${buffer.length} bytes)`)
        }

        fs.writeFileSync(downloadsPath, buffer)

        HelloWorkWindow.webContents.send('helloWork-progress', {
          count: count,
          total: total,
          success: item.求人番号,
          url: jobUrl
        })
      } catch (err: any) {
        HelloWorkWindow.webContents.send('helloWork-progress', {
          count: count,
          total: total,
          error: item.求人番号,
          url: filename
        })
      } finally {
        if (browser) await browser.close()
      }
    } catch (e) {
      //
    }
  }
}
