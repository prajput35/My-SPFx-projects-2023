<#
.SYNOPSIS
Adds the App to the SharePoint App Catalog
.DESCRIPTION
.EXAMPLE
.\spo-app-add.ps1 -PackageFolder "$(System.DefaultWorkingDirectory)/$(ProjectFolder)/drop/$(SolutionPackageLocation)/" -packageName "$(PackageName)" -URL "$(SiteCollection)"
Installing the App command from CI-CD Pipeline
.EXAMPLE
.\spo-app-add.ps1 -PackageFolder "C:\Arjun\Codes\m365-ci-cd-solution\SPFx-CI-CD-Setup\SPFx-CICD-1\sharepoint\solution\" -packageName "sp-fx-cicd-1.sppkg" -URL "https://contoso.sharepoint.com/sites/M365CLI"
Installing the app from base machine
#>
Param(

    [Parameter(Mandatory = $true)]
    [string]$PackageFolder,
    [Parameter(Mandatory = $true)]
    [string]$packageName,
    [Parameter(Mandatory = $true)]
    [string]$URL,
    [Parameter(Mandatory = $false)]
    [boolean]$IsAdd = $true,
    [Parameter(Mandatory = $false)]
    [boolean]$IsDeploy = $true,
    [Parameter(Mandatory = $false)]
    [boolean]$IsInstall = $true
)


function addCustomApp {

    $CompletePath = "$PackageFolder/$packageName"

    Write-Host "Deploying the Package from the path : "$CompletePath

    #Check if App is already installed
    $IsDeployed = checkIfAppIsInstalled -packageName $packageName -URL $URL

    if ($IsAdd) {
        Write-Host "App not Available. Adding the app to  App Catalog with Package Name : $packageName"
        $AppId = m365 spo app add --filePath $CompletePath --appCatalogUrl $URL --overwrite --output text
        Write-Host "Added the App to the Site Collection. App ID : $AppId"
    }

    if ($IsDeploy) {
        #Deploy the app
        deployCustomApp -URL $URL -AppId $AppId
        Write-Host "Deployed App with ID : $AppId"
    }

    if ($IsInstall) {
        #Install Custom App
        if ($IsDeployed) {
            Write-Host "App is already deployed. Hence skipping installation"
        }
        else {
            Write-Host "App with name $packageName is not deployed. Installing it now"
            installCustomApp -URL $URL -AppId $AppId
        }
    }
}

function deployCustomApp {
    param (
        [Parameter(Mandatory = $true)]
        [string]$AppId,
        [Parameter(Mandatory = $true)]
        [string]$URL
    )

    Write-Host "Deploying App with ID : $AppId"
    m365 spo app deploy --id $AppId --appCatalogUrl $URL
}

function installCustomApp {
    param (
        [Parameter(Mandatory = $true)]
        [string]$AppId,
        [Parameter(Mandatory = $true)]
        [string]$URL
    )

    Write-Host "Installing App with ID : $AppId"
    m365 spo app install --id $AppId --siteUrl $URL
}

function checkIfAppIsInstalled {
    param (
        [Parameter(Mandatory = $true)]
        [string]$packageName,
        [Parameter(Mandatory = $true)]
        [string]$URL
    )

    $IsDeployed = (m365 spo app get --name $packageName --appCatalogUrl $URL --output json --query "{Deployed: Deployed}") | ConvertFrom-Json

    return $IsDeployed.Deployed
}

addCustomApp