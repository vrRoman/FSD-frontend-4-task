import './slider';
import './demo/demo';

// eslint-disable-next-line no-undef
const importAll = (requireContext: __WebpackModuleApi.RequireContext) => {
  requireContext.keys().forEach(requireContext);
};

importAll(require.context('./', true, /\.s[ac]ss$/));
importAll(require.context('./', true, /\.(png|svg|ico)$/));
importAll(require.context('./', true, /\.(xml|webmanifest)$/));
