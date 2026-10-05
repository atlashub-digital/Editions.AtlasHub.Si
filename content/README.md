# Editorial content layer

The first visual foundation keeps copy in application modules for speed of prototyping.

Before production scale, long-form publications should move to a canonical content layer, preferably MDX or a normalized editorial pipeline fed from the approved manuscript source.

Target pattern:

```text
canonical manuscript
      ↓
editorial normalization
      ↓
MDX / structured metadata
      ↓
web reading edition
      ↓
print CSS / PDF / eBook / audio / toolkit
```

Do not duplicate authoritative manuscript text across multiple uncontrolled files.
