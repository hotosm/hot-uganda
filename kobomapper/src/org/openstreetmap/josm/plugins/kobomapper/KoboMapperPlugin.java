// License: GPL. For details, see LICENSE file.
package org.openstreetmap.josm.plugins.kobomapper;

import org.openstreetmap.josm.Main;
import org.openstreetmap.josm.gui.MainApplication;
import org.openstreetmap.josm.gui.MainMenu;
import org.openstreetmap.josm.gui.MapFrame;
import org.openstreetmap.josm.gui.layer.Layer;
import org.openstreetmap.josm.gui.preferences.PreferenceSetting;
import org.openstreetmap.josm.plugins.Plugin;
import org.openstreetmap.josm.plugins.PluginInformation;
import org.openstreetmap.josm.plugins.kobomapper.actions.*;
import org.openstreetmap.josm.tools.Logging;

import javax.swing.*;
import java.awt.event.KeyEvent;

import static org.openstreetmap.josm.gui.help.HelpUtil.ht;
import static org.openstreetmap.josm.tools.I18n.tr;



public class KoboMapperPlugin extends Plugin {
    static String VERSION = "3.0";

    static JMenu koboJMenu;

    public static String source = "";

    // true if the checkbox "auto-sourcing" is set in the plugin menu
    public static boolean autoSourcing = false;

    // true when the plugin is first used, e.g. grab from WMS or download cache file
    public static boolean pluginUsed = false;

    public static String cacheDir = null;

    public static boolean alterColors = false;

    public static boolean backgroundTransparent = false;

    public static float transparency = 1.0f;

    public static boolean drawBoundaries = false;

    public static int imageWidth, imageHeight;

    public static String grabLayers, grabStyles = null;

    private static boolean menuEnabled = false;

   



    /**
     * Creates the plugin and setup the default settings if necessary.
     * @param info plugin information
     */
    public KoboMapperPlugin(PluginInformation info) {
        super(info);
        Logging.info("Pluging KoboMapper v"+VERSION+" started...");
        refreshMenu();
        //DownloadDialog.addDownloadSource(new CadastreDownloadSource());
    }

  

    public static void refreshMenu() {
        MainMenu menu = MainApplication.getMenu();

        if (koboJMenu == null) {
            koboJMenu = menu.addMenu("KoboMapper", tr("KoboMapper"), KeyEvent.VK_C, menu.getDefaultMenuPos(), ht("/Plugin/KoboMapper"));
            JMenuItem menuGetLayers = new JMenuItem(new MenuActionGetLayers());
            JMenuItem menuGetLayer = new JMenuItem(new GetLayerAction());
            JMenuItem menuuploadData = new JMenuItem(new UploadDataAction());
            koboJMenu.add(menuGetLayers);
            koboJMenu.add(menuGetLayer);
            koboJMenu.add(menuuploadData);
            koboJMenu.add(new JMenuItem(new MenuActionOpenPreferences()));

        }

    }

    
    

    public static void safeSleep(long milliseconds) {
        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException e) {
            Logging.debug(e);
        }
    }


    @Override
    public PreferenceSetting getPreferenceSetting() {
        return new KoboPreferenceSetting();
    }


    @Override
    public void mapFrameInitialized(MapFrame oldFrame, MapFrame newFrame) {
        if (koboJMenu != null) {
            if (oldFrame == null && newFrame != null) {

                //MainApplication.getMap().addMapMode(new IconToggleButton(new org.openstreetmap.josm.plugins.kobomapper.actions.SaveAction()));
            } else if (oldFrame != null && newFrame == null) {


            }
        }
    }


    // See OptionPaneUtil
    // FIXME: this is a temporary solution.
    public static void prepareDialog(JDialog dialog) {
        if (Main.pref.getBoolean("window-handling.option-pane-always-on-top", true)) {
            try {
                dialog.setAlwaysOnTop(true);
            } catch (SecurityException e) {
                Logging.warn(tr("Warning: failed to put option pane dialog always on top. Exception was: {0}", e.toString()));
            }
        }
        dialog.setModal(true);
        dialog.toFront();
        dialog.setDefaultCloseOperation(JDialog.DISPOSE_ON_CLOSE);
    }

    /**
     * Adds the WMSLayer following this rule:<ul>
     * <li>if a WMSLayer exists place this new layer just before this layer</li>
     * <li>Otherwise place it at the bottom</li>
     * </ul>
     * @param wmsLayer the wmsLayer to add
     */
    public static void addWMSLayer(Layer wmsLayer) {
        if (MainApplication.isDisplayingMapView()) {
            int wmsNewLayerPos = MainApplication.getLayerManager().getLayers().size();
            for (Layer l : MainApplication.getLayerManager().getLayersOfType(Layer.class)) {
                int wmsPos = MainApplication.getLayerManager().getLayers().indexOf(l);
                if (wmsPos < wmsNewLayerPos) wmsNewLayerPos = wmsPos;
            }
            MainApplication.getLayerManager().addLayer(wmsLayer);
            // Move the layer to its new position
            MainApplication.getMap().mapView.moveLayer(wmsLayer, wmsNewLayerPos);
        } else
            MainApplication.getLayerManager().addLayer(wmsLayer);
    }

    

    
}
