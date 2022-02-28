
# Cordially

A straightforward web-based single-event invitation/RSVP management system.
Intended for personal occassions like parties and weddings (it was used for mine!).
At it's core, it's an easy to use form engine that is laser focused on the above use case.
Comprises of an API (TypeScript/Express), admin client (React) and customizeable guest client (PetiteVue).

- Hosts: add guests and a list properties that guests should fill in (like RSVP,
attendee count, vegetarian preference etc.). Invite simply by sending an invitation link.
- Guests: view individualised invitation and set preferences (any time until a pre-set date).

Features:

- Simple link-based authentication, no passwords or user management for either guests or hosts
- Fully multi-language
- Bulk upload guest data from spreadsheets (tsv)
- Custom theming, includes 2 nice responsive templates

At the moment the intended use cases is a predefined list of guests and RSVP properties.

Sample images to showcase the workflow:

<img align="left" src="https://i.imgur.com/LWuQEFy.jpg" width="200" style="margin: 10px">
<img align="left" src="https://i.imgur.com/33fqVen.jpg" width="200" style="margin: 10px">
<img align="left" src="https://i.imgur.com/RVXvt0e.jpg" width="200" style="margin: 10px">

<br style="clear: both">

#### Roadmap

- [ ] Finalize admin interface
- [ ] Finalize templates
- [ ] Rationalize batch processing performance
- [ ] Use Vite build for both admin and guest client

### Motivation
Previously I hated the notion of "wedding websites": they seemed superfluous and cringy. But while organising our own,
I quickly realised it's the best way to invite guests: as a host you might not want to personally visit every guest,
or know the postal address of them, or hassle with paper invitations at all. You want a place that gathers all info,
and you don't want guests to individually communicate their (constantly changing) RSVP or preferences. Especially for events with 100+ guests.

I looked through the available options:
- **dedicated sites like [theknot](https://www.theknot.com/)** - These sites cater to very wide masses for profit reasons, therefore their product seemed bloated, and containing ads (at least for themselves). Also privacy takes a backseat - not only towards the service provider, but to wide masses - at the time of the writing for the aforementioned site, I could browse random future weddings, and even search the guest list by name(!), and change guest RSVPs(!!!).
- **open source projects like in [this](https://github.com/topics/wedding) or [this](https://github.com/topics/rsvp) list** - I reviewed a couple dozen of these. Most are personal or learning projects (RSVP is a great "Todo" alternative) and few of them was meant for universal use, let alone production ready. Those that were, were either outdated, or very limited feature-wise.
- **Form services like google forms or jotform** - besides the unwanted reliance on third parties, these services are based on single user submissions - fishing out submissions from the same user is tiresome. Also, they often limit design possibilities.
- **CMS/Wordpress + form plugins** - like before, these are also based on single submissions. Instead of taking the time to hack them as needed, I might as well start this project.

### Installation

You only need `node` 16+ and an `npm i` to install dependencies.

Execute `npx init` to set up the database, and create the default admin user.

// TODO

### Usage

// TODO
