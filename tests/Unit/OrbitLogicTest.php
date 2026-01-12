<?php

test('contoh unit test logic sederhana', function () {
    $hasil = 1 + 1;

    expect($hasil)->toBe(2);
});

test('string manipulation test', function () {
    $name = 'Orbit';

    expect(strtoupper($name))->toBe('ORBIT');
});
