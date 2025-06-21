import { Label } from '@radix-ui/react-label'
import { Switch } from '@radix-ui/react-switch'
import { Bell } from 'lucide-react'
import React from 'react'

function notificationsSettings() {
    return (
        <div>
            {/* Notifications - Like LinkedIn's "Notifications" */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <Bell className="h-5 w-5 text-brand" />
                    <h2 className="text-lg font-semibold">Notifications</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Job Alerts</Label>
                            <p className="text-sm text-gray-500">New jobs matching your profile</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Messages</Label>
                            <p className="text-sm text-gray-500">When you receive new messages</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Application Updates</Label>
                            <p className="text-sm text-gray-500">Status changes on your applications</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default notificationsSettings