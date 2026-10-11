<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Keep the fixed TanStack Start bootstrap and file-based routes; each shareable page owns its metadata so navigation and social previews remain page-specific.
- Keep the frontend prototype state in PrototypeProvider and seed it from separate typed mock-data modules; this preserves edits between navigation without implying a connected service.
- Split feature screens from the shared ChatFlow shell, widget preview, and wizard; these boundaries allow future service integration without rewriting the interface.
- Use AI Elements Conversation, MessageResponse, and PromptInput for chat transcripts and composers; maintain compatibility with the installed primitives and keep responses simulated.
- Define all colors, gradients, and shadows as semantic tokens in the global Tailwind v4 stylesheet; feature code consumes roles instead of literal colors.
