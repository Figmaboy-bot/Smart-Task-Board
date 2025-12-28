



/* Carousel navigation buttons */




/* Carousel wrapper */





.tasks-track::-webkit-scrollbar {
    display: none;
}

.task {
    flex: 0 0 350px;
    max-width: 350px;
    width: 350px;

    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tag-status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}

.tag {
    background: #F3F4F6;
    color: #374151;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
}

.statuscircle {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.status {
    font-size: 12px;
    color: #6B7280;
    font-weight: 500;
}

.task-body {
    margin-bottom: 20px;
}

.task-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
}

.task-subtitle {
    font-size: 14px;
    color: #6B7280;
    line-height: 1.5;
}

.task-footer {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid #E5E7EB;
}

.profile {
    display: flex;
    align-items: center;
    gap: 10px;
}

.profile-img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
}

.profile-name {
    font-size: 14px;
    color: #111827;
    font-weight: 500;
}

.who {
    color: #9CA3AF;
    font-weight: 400;
}

.datetime,
.links {
    display: flex;
    align-items: center;
    gap: 8px;
}

.datetime-icon {
    width: 16px;
    height: 16px;
    color: #6B7280;
}

.datetime-text,
.linkamount {
    font-size: 14px;
    color: #6B7280;
}