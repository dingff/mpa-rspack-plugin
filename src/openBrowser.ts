/**
 * The following is modified based on source found in
 * https://github.com/facebook/create-react-app
 *
 * MIT Licensed
 * Copyright (c) 2015-present, Facebook, Inc.
 * https://github.com/facebook/create-react-app/blob/master/LICENSE
 *
 */
import type { ExecOptions } from 'child_process'

const { exec } = require('child_process')
const { join } = require('path')

const open = require('open')

export default async function openBrowser(url: string) {
  const supportedChromiumBrowsers = [
    'Google Chrome Canary',
    'Google Chrome Dev',
    'Google Chrome Beta',
    'Google Chrome',
    'Microsoft Edge',
    'Brave Browser',
    'Vivaldi',
    'Chromium',
  ]
  if (process.platform === 'darwin') {
    try {
      const ps = await execAsync('ps cax')
      const openedBrowser = supportedChromiumBrowsers.find((b) => ps.includes(b))
      if (openedBrowser) {
        // Try our best to reuse existing tab with AppleScript
        await execAsync(
          `osascript openChrome.applescript "${encodeURI(
            url,
          )}" "${openedBrowser}"`,
          {
            cwd: join(__dirname, 'bin'),
          },
        )
        return true
      }
    } catch (err) {
      // Ignore errors
    }
  }
  try {
    open(url).catch(() => {}) // Prevent `unhandledRejection` error.
    return true
  } catch (err) {
    return false
  }
}
function execAsync(command: string, options?: ExecOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, options, (error: any, stdout: any) => {
      if (error) {
        reject(error)
      } else {
        resolve(stdout.toString())
      }
    })
  })
}
