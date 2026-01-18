<?php

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;

test('sends verification notification', function () {
    $this->markTestSkipped('Email verification disabled - app uses username authentication');
});

test('does not send verification notification if email is verified', function () {
    $this->markTestSkipped('Email verification disabled - app uses username authentication');
});
