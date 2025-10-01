import { m } from "framer-motion";
import rehypeSlug from "rehype-slug";
import ReactMarkdown from "react-markdown"; // Import react-markdown

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";

import { varFade, MotionViewport } from "src/components/animate";

export function HomeContent({ mdContent, frontMatter, sx, ...other }) {
  return (
    <Box
      component="section"
      sx={[{ overflow: "hidden" }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container component={MotionViewport} sx={{ py: { xs: 10, md: 15 } }}>
        <m.div variants={varFade("inUp")}>
          <Typography
            component="div" variant="subtitle1"
            sx={{ mx: "auto", maxWidth: 640, color: "text.secondary" }}
          >
            <ReactMarkdown
              rehypePlugins={[rehypeSlug]}
              components={{
                a: ({ href, children }) => (
                  <Link href={href} underline="hover">
                    {children}
                  </Link>
                ),
                h1: ({ node, children, ...props }) => {
                  const id = node?.properties?.id;
                  return (
                    <h1
                      id={id}
                      style={{ margin: '2rem 0 1rem', fontSize: '2.25rem', fontWeight: 700, color: 'inherit' }}
                      {...props}
                    >
                      {id ? (
                        <a href={`#${id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {children}
                        </a>
                      ) : children}
                    </h1>
                  );
                },
                h2: ({ node, children, ...props }) => {
                  const id = node?.properties?.id;
                  return (
                    <h2
                      id={id}
                      style={{ margin: '2rem 0 1rem', fontSize: '1.5rem', fontWeight: 600, color: 'inherit' }}
                      {...props}
                    >
                      {id ? (
                        <a href={`#${id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {children}
                        </a>
                      ) : children}
                    </h2>
                  );
                },
                ul: ({ children }) => (
                  <ul style={{ paddingLeft: 24, marginBottom: 16, listStyleType: 'disc' }}>{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol style={{ paddingLeft: 24, marginBottom: 16, listStyleType: 'decimal' }}>{children}</ol>
                ),
                li: ({ children, ...props }) => (
                  <li style={{ paddingLeft: 8, marginBottom: 4, display: 'list-item' }} {...props}>
                    {children}
                  </li>
                ),
              }}
            >
              {mdContent}
            </ReactMarkdown>
          </Typography>
        </m.div>
      </Container>
    </Box>
  );
}
