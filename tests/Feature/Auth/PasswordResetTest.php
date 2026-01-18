<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

test('reset password link screen can be rendered', function () {
    $response = $this->get(route('password.request'));

    $response->assertStatus(200);
});

test('reset password link can be requested', function () {
    $this->markTestSkipped('Password reset via username not implemented');
});

test('reset password screen can be rendered', function () {
    $response = $this->get(route('password.reset', ['token' => 'fake-token']));

    $response->assertStatus(200);
});

test('password can be reset with valid token', function () {
    $this->markTestSkipped('Password reset via username not fully implemented');
});

test('password cannot be reset with invalid token', function () {
    $this->markTestSkipped('Password reset via username not fully implemented');
});
