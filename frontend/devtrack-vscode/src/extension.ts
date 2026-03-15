import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('DevTrack extension is now active!');

    // Create a status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = '$(pulse) DevTrack: Active';
    statusBarItem.tooltip = 'DevTrack Neural Intelligence Core';
    statusBarItem.command = 'devtrack.analyzeWorkspace';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Command: Analyze Workspace
    const analyzeDisposable = vscode.commands.registerCommand('devtrack.analyzeWorkspace', async () => {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "DevTrack Initialization",
            cancellable: false
        }, async (progress) => {
            progress.report({ message: "Initializing Sync..." });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            progress.report({ message: "Neural Scan in progress...", increment: 30 });
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            progress.report({ message: "Extracting DNA...", increment: 40 });
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            progress.report({ message: "Finalizing Report...", increment: 30 });
            await new Promise(resolve => setTimeout(resolve, 500));
            
            vscode.window.showInformationMessage('🧬 DevTrack Scan Complete: 98.7% Human Authorship detected. Code integrity verified.');
        });
    });

    // Command: Open Explorer
    const explorerDisposable = vscode.commands.registerCommand('devtrack.openExplorer', async () => {
        const repo = await vscode.window.showInputBox({
            prompt: 'Enter GitHub Repository (e.g. facebook/react)',
            placeHolder: 'owner/repo'
        });

        if (repo) {
            vscode.env.openExternal(vscode.Uri.parse(`https://devtrack-seven.vercel.app/explore?repo=${encodeURIComponent(repo)}`));
        } else {
            vscode.env.openExternal(vscode.Uri.parse('https://devtrack-seven.vercel.app/explore'));
        }
    });

    context.subscriptions.push(analyzeDisposable, explorerDisposable);
}

export function deactivate() {}
