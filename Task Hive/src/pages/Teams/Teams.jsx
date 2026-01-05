import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import './Teams.css';
import { IconButton, OutlineButton } from "../../components/Buttons/Buttons";
import { PlusCircleIcon, FunnelIcon } from "@heroicons/react/24/outline";
import * as React from 'react';

export default function Teams() {
    return (
        <div className="teams-page">
            <Sidebar />
            <div className="teams-content">
                <Header onNotificationClick={() => {}} />
                <div className="teams-main">
                    <div className="team-top-content">
                        <h2>Teams Page</h2>
                        <div className="top-buttons">
                            <IconButton 
                                icon={PlusCircleIcon}
                                text="Add Team"
                                className="Add-Task"
                            />
                            <OutlineButton 
                                icon={FunnelIcon}
                                text="Filter"
                                className="Manage-Teams"
                            />
                        </div>
                    </div>
                    {/* You can add your own content here */}
                </div>
            </div>
        </div>
    );
}