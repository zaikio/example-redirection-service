# Example Redirection Service

## Concept

In a situation with hundreds or thousands of OAuth redirect endpoints, it
isn't always feasible to statically declare them as part of app config.

This service enables you to host a single app as the recipient of your
redirect, and then use a shared secret to pass an encrypted state
parameter to this app through the OAuth process. This app will then
decrypt the parameter and redirect onwards to a URL provided, merging
the query variables into the URL to enable the OAuth dance to successfully
complete.

## Security

This is imperfect, due to requiring shared secrets, however given that
the redirection app does not have any OAuth credentials, the blast radius
is limited somewhat.

Adding storage and route creation APIs is another approach here which could
become more secure, that is left as an exercise for the user though.

## Setup

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run generatekey` to generate a sample encryption key

## Usage

1. Deploy this application somewhere publicly accessible, such as on Heroku
2. Set a shared encryption key for app and the connected systems
3. Set the redirect URL from this app in your Zaikio App config on the Zaikio Hub
4. Encode the OAuth request parameters as follows:
  - set the final redirect as the state parameter of the OAuth authorize request
  - set this app as the redirect URL for the authorize request
5. When the request is redirected, this app will handle it, decode the state parameter

A NodeJS example for encoding is available in the `crypt.mjs` file in
this repo.

Using PHP, an example could be:

```php
<?php
$key = $_ENV["ENCRYPTION_KEY"];
$plaintext = json_encode(array("u" => "http://example.org"));
$cipher = "aes-256-cbc";
if (in_array($cipher, openssl_get_cipher_methods()))
{
    $ivlen = openssl_cipher_iv_length($cipher);
    $iv = openssl_random_pseudo_bytes($ivlen);
    $ciphertext = openssl_encrypt($plaintext, $cipher, $key, $options=0, $iv);

    return $iv."--".$ciphertext;
}
```

## Support

This is example code and is unsupported.
