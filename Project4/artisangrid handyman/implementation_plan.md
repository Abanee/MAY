# Fix About Page Empty Space & Implement Dashboard Slide-in Hamburger Menu

This implementation plan covers:
1. Fixing the empty space under the "Are you a Skilled Artisan?" section in the About page at tablet (768px) viewport size.
2. Refactoring the Dashboard layout on tablet & mobile views (max-width: 1024px) to replace the top horizontal tab bar with a premium slide-in hamburger drawer menu from the left side, featuring the branding logo.

## User Review Required

> [!NOTE]
> The About page Join section has been adjusted to stay in a 2-column layout down to `640px` width (previously, it stacked at `768px`). This uses the available horizontal tablet screen space efficiently, matching the desktop appearance and removing the unbalanced empty space. On screens narrower than `640px`, it stacks cleanly.

> [!IMPORTANT]
> The Dashboard sidebar will now slide in from the left side on tablet and mobile view (`max-width: 1024px`) when toggled. A semi-transparent blurred backdrop will overlay the main content.

## Proposed Changes

### CSS Layout Adjustments

#### [MODIFY] [pages.css](file:///c:/Users/abane/Music/Free_lancing/MAY/Project4/artisangrid%20handyman/pages.css)
- Change the media query breakpoint for `.cta-banner-inner` from `max-width: 768px` to `max-width: 640px`. This keeps it in a 2-column layout on 768px (iPad portrait) view and only stacks on smaller mobile screens.

#### [MODIFY] [dashboard.css](file:///c:/Users/abane/Music/Free_lancing/MAY/Project4/artisangrid%20handyman/dashboard.css)
- Add styles for `.dash-mobile-header` (hidden on desktop, flex layout with logo and hamburger on tablet/mobile).
- Add styles for `.dash-sidebar-backdrop` (blur overlay on tablet/mobile, hidden on desktop).
- Add styles for `.dash-sidebar-brand` to display logo branding inside the sidebar.
- Refactor the `@media (max-width: 1024px)` media query:
  - Remove horizontal navigation bar layouts (e.g. `flex-direction: row` on sidebar and sidebar nav).
  - Transform `.dash-sidebar` into a fixed slide-in drawer layout (`position: fixed`, `left: 0`, `transform: translateX(-100%)`).
  - Add RTL direction compatibility support for slide-in drawer (`right: 0`, `transform: translateX(100%)`).
  - Keep sidebar profile and nav vertically aligned as in desktop.

### HTML Structure Adjustments

#### [MODIFY] [dashboard.html](file:///c:/Users/abane/Music/Free_lancing/MAY/Project4/artisangrid%20handyman/dashboard.html)
- Add the branding logo at the top of the sidebar inside `<aside class="dash-sidebar">`.
- Add `<header class="dash-mobile-header">` at the top containing the logo link and the hamburger button.
- Add `<div class="dash-sidebar-backdrop" id="dash-sidebar-backdrop"></div>` for closing drawer when clicking outside.

### JS Navigation Behavior

#### [MODIFY] [dashboard.js](file:///c:/Users/abane/Music/Free_lancing/MAY/Project4/artisangrid%20handyman/dashboard.js)
- Add event listeners for toggling the sidebar drawer on mobile:
  - Clicking the hamburger button opens/closes it.
  - Clicking the backdrop closes it.
  - Clicking any tab/navigation item switches tabs and automatically closes the sidebar drawer.
  - Animate the hamburger button spans into an 'X' icon when the drawer is open.

## Verification Plan

### Manual Verification
- **About Page Layout**:
  - Open `about.html` and resize the viewport to 768px width.
  - Verify that the Join section shows the description/title on the left and the checklist/button on the right.
  - Verify that there is no empty space on the right side.
  - Shrink the viewport to <640px and verify it stacks vertically.
- **Dashboard Layout**:
  - Open `dashboard.html`.
  - On desktop (>1024px), verify the sidebar stays static on the left with the brand logo.
  - Resize the viewport to <=1024px.
  - Verify the horizontal tab bar is replaced by a mobile header with a logo and hamburger button.
  - Click the hamburger button; verify the drawer slides in from the left and has a backdrop.
  - Verify the drawer contains the logo, profile information, and the vertical tabs.
  - Click on a tab (e.g., 'Book a Job') and verify it switches tabs and closes the drawer.
  - Click the backdrop; verify the drawer closes.
  - Toggle the layout direction to RTL (if testable) and verify drawer slides in from the right.
