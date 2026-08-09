'use client'

import { Bell, Lock, Globe, Moon, HelpCircle, LogOut, ChevronRight, type LucideIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'

interface SettingsItem {
  icon: LucideIcon
  label: string
  description: string
  /** A custom control (e.g. a toggle switch) rendered in place of the default chevron. */
  action?: ReactNode
  /** A static value shown before the chevron (e.g. "English"). */
  value?: string
}

interface SettingsSection {
  title: string
  items: SettingsItem[]
}

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)

  const settingsSections: SettingsSection[] = [
    {
      title: 'Display',
      items: [
        {
          icon: Moon,
          label: 'Dark Mode',
          description: 'Enable dark mode for comfortable viewing',
          action: (
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                darkMode ? 'bg-accent' : 'bg-secondary'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          ),
        },
        {
          icon: Globe,
          label: 'Language',
          description: 'Choose your preferred language',
          value: 'English',
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          description: 'Receive alerts for live matches and updates',
          action: (
            <button
              onClick={() => setNotifications((prev) => !prev)}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                notifications ? 'bg-accent' : 'bg-secondary'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          ),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: Lock,
          label: 'Change Password',
          description: 'Update your account password',
          value: '•••••••••',
        },
        {
          icon: Lock,
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          value: 'Disabled',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', description: 'Get help with HAFI' },
        { icon: Globe, label: 'Terms of Service', description: 'Read our terms and conditions' },
        { icon: Globe, label: 'Privacy Policy', description: 'Learn how we use your data' },
      ],
    },
  ]

  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <section>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </section>

      {/* Settings Sections */}
      {settingsSections.map((section) => (
        <section key={section.title} className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
          <div className="space-y-2">
            {section.items.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl bg-card border border-border p-4 hover:border-accent transition-colors group cursor-pointer"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <Icon className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground group-hover:text-accent transition-colors">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                  {item.action ? (
                    item.action
                  ) : item.value ? (
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ))}

      {/* Logout */}
      <section className="pt-8 border-t border-border">
        <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 font-medium text-red-500 hover:bg-red-500/20 transition-colors">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </section>

      {/* Account Info */}
      <section className="space-y-2 rounded-xl bg-secondary/50 p-4 text-center">
        <p className="text-xs text-muted-foreground">App Version</p>
        <p className="font-mono text-sm text-foreground">1.0.0</p>
      </section>
    </div>
  )
}
