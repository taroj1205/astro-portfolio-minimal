# Portfolio design

## Idea

A personal site that leads with Shintaro's own photos. The strip of photos
under the greeting is the one bold moment; everything else stays quiet and
readable so uni friends and developers can both follow it.

## Palette

Colours come from the photos. Light only, no dark mode.

| Token   | Hex       | Use                                 |
| ------- | --------- | ----------------------------------- |
| `sky`   | `#F2F5F5` | page background (overcast Auckland) |
| `paper` | `#FFFFFF` | code backgrounds, lightbox text     |
| `ink`   | `#16323B` | text (harbour slate)                |
| `stone` | `#56676C` | secondary text                      |
| `tide`  | `#1C7178` | links (sea glass)                   |
| `sun`   | `#EE8A1E` | link hover and text selection only  |
| `line`  | `#D3DCDD` | row dividers                        |

## Type

Mona Sans only. Headings use the wide width (`font-stretch: 125%`) at heavy
weights; body text uses the normal width at 18px / 1.6.

## Layout

- Left aligned, 12-column grid, max width 75rem.
- Section heading on the left, short intro on the right.
- Work is a list of rows, not cards.
- Motion: one load sequence in the hero, plus the photo lightbox opening.

## Writing

Plain, first person, no jargon. Explain projects by what they do for people.
