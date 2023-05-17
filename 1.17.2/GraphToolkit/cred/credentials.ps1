param(
    [string]$TenantUrl,
    [string]$ClientId,
    [string]$ClientSecret
)

# Import the SharePointPnPPowerShellOnline module
Import-Module SharePointPnPPowerShellOnline

# Create a secure string from the client secret
$secureClientSecret = ConvertTo-SecureString -String $ClientSecret -AsPlainText -Force

# Create a PnP authentication object
$credentials = New-Object -TypeName Microsoft.SharePoint.Client.SharePointOnlineCredentials -ArgumentList $ClientId, $secureClientSecret

# Connect to SharePoint Online
Connect-PnPOnline -Url $TenantUrl -Credentials $credentials
