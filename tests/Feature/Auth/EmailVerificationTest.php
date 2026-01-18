<?php

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;

test('email verification screen can be rendered', function () {
    $this->markTestSkipped('Email verification disabled - app uses username authentication');
});

test('email can be verified', function () {
    $this->markTestSkipped('Email verification disabled - app uses username authentication');
});

test('email is not verified with invalid hash', function () {
    $this->markTestSkipped('Email verification disabled - app uses username authentication');
});

test('email is not verified with invalid user id', function () {
    $this->markTestSkipped('Email verification disabled - app uses username authentication');
});

test('verified user is redirected to dashboard from verification prompt', function () {
    $this->markTestSkipped('Email verification disabled - app uses username authentication');
});

test('already verified user visiting verification link is redirected without firing event again', function () {
    $this->markTestSkipped('Email verification disabled - app uses username authentication');
});
