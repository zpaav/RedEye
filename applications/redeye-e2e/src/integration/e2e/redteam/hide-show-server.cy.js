/// <reference types="cypress" />

describe('Hide a server', () => {
	const camp = 'hideshowserver';
	const fileName = 'gt.redeye';
	const camp2 = 'cancelhideserver';
	const fileName2 = 'smalldata.redeye';

	it('Hide server via Meta tab using toggle in left nav panel', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Toggle switch to not show hidden items
		cy.doNotShowHiddenItems();

		// Get the name of the server
		cy.get('[cy-test=hostName]')
			.eq(0)
			.invoke('text')
			.then((serverName) => {
				// Hide server via the Meta tab
				cy.get('[cy-test=info-row]').contains(serverName).click();
				cy.clickMetaTab();
				cy.showHideServerMetaTab();

				// Verify list shows nothing (hiding server hides all hosts under it)
				// cy.get('[cy-test=message-row]').contains('No Hosts').should('exist');

				// Toggle switch back on
				cy.showHiddenItems();

				// Verify hidden server now shows again
				cy.get('[cy-test=hosts-view]').should('contain', serverName);

				// Unhide the server
				cy.get('[cy-test=info-row]').contains(serverName).click();
				cy.clickMetaTab();
				cy.showHideServerMetaTab();

				// Toggle off switch for hidden items
				cy.doNotShowHiddenItems();
				cy.wait(1000);

				// Verify server still shows
				cy.get('[cy-test=hosts-view]').should('contain', serverName);
			});
	});

	it('Hide server via Meta tab using toggle on main page', () => {
		// Toggle off switch for hidden items on the main page
		cy.doNotShowHiddenItems();

		// Search for campaign by name and open
		cy.selectCampaign(camp);

		// Get the name of the server
		cy.get('[cy-test=hostName]')
			.eq(0)
			.invoke('text')
			.as('hiddenHost')
			.then((serverName) => {
				// Hide the server via the Meta tab
				cy.get('[cy-test=info-row]').contains(serverName).click();
				cy.clickMetaTab();
				cy.showHideServerMetaTab();

				// Verify list shows nothing (hiding server hides all hosts under it)
				// cy.get('[cy-test=message-row]').contains('No Hosts').should('exist');

				// Toggle switch back on to show hidden items
				cy.returnToCampaignCard();
				cy.showHiddenItems();

				// Verify hidden server now shows again
				cy.selectCampaign(camp);
				cy.get('[cy-test=hosts-view]').should('contain', serverName);

				// Unhide the server
				cy.get('[cy-test=info-row]').contains(serverName).click();
				cy.clickMetaTab();
				cy.showHideServerMetaTab();

				// Toggle switch off to hide hidden items
				cy.returnToCampaignCard();
				cy.doNotShowHiddenItems();

				// Go back into campaign and verify server still shows
				cy.selectCampaign(camp);
				cy.get('[cy-test=hosts-view]').should('contain', serverName);
			});
	});

	it('Hide server using the kebab menu', () => {
		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Get the name of the first host
		cy.get('[cy-test=hostName]')
			.eq(0)
			.invoke('text')
			.then((serverName) => {
				// Hide the server in the list
				cy.showHideItem(0);

				// Verify confirmation modal appears
				cy.get('.bp4-dialog-body').should('exist');

				// Confirm that you want to hide the server
				cy.confirmShowHide();

				// Verify list shows nothing (hiding server hides all hosts under it)
				// cy.get('[cy-test=message-row]').contains('No Hosts').should('exist');

				// Go to settings and toggle swtich to show hidden
				cy.showHiddenItems();

				// Verify hidden server now shows in the list again
				cy.get('[cy-test=hosts-view]').should('contain', serverName);

				// Set server to show again
				cy.showHideItem(0);

				// Verify confirmation modal appears
				cy.get('.bp4-dialog-body').should('exist');

				// Confirm that you want to show the host
				cy.confirmShowHide();

				// Go to settings and toggle switch to not show hidden
				cy.doNotShowHiddenItems();

				// Verify host still appears in the list
				cy.get('[cy-test=hosts-view]').should('contain', serverName);
			});
	});

	it('Verify Cancel button works from Meta tab', () => {
		cy.uploadCampaign(camp2, fileName2);

		// Search for new campaign by name
		cy.selectCampaign(camp2);

		// Select the server, go to Meta tab, click show/hide link
		cy.get('[cy-test=hostName]').eq(0).click();
		cy.clickMetaTab();
		cy.get('[cy-test=show-hide-this-server]').click();

		// Verify modal shows; click Cancel
		cy.verifyDialogBoxAppears();

		cy.cancelShowHide();

		// Verify modal disappears
		cy.verifyDialogBoxDisappears();

		// Verify the Meta tab link says "Hide this server" vs. "Show"
		cy.get('[cy-test=show-hide-this-server]').invoke('text').should('eq', 'Hide this server');
	});

	it('Verify Cancel button works from kebab menu', () => {
		// Search for new campaign by name
		cy.selectCampaign(camp2);

		// Click kebab menu for first hostto bring up options; click "Hide Server"
		cy.get('[cy-test=quick-meta-button]').eq(0).click();
		cy.get('[cy-test=show-hide-item]').click();

		// Verify modal shows; click Cancel
		cy.verifyDialogBoxAppears();

		cy.cancelShowHide();

		// Verify modal disappears
		cy.verifyDialogBoxDisappears();

		// Verify the kebab menu link still says "Hide Server" vs. "Show"
		cy.get('[cy-test=quick-meta-button]').eq(0).click();
		cy.get('[cy-test=show-hide-item]').invoke('text').should('eq', 'Hide  Server');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
		cy.deleteCampaignGraphQL(camp2);
	});
});