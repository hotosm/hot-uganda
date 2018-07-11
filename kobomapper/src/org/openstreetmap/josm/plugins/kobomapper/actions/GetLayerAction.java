package org.openstreetmap.josm.plugins.kobomapper.actions;

import org.openstreetmap.josm.Main;
import org.openstreetmap.josm.actions.JosmAction;
import org.openstreetmap.josm.plugins.kobomapper.utils.GeoserverApi;
import org.openstreetmap.josm.tools.GBC;
import org.openstreetmap.josm.tools.Logging;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;

import static org.openstreetmap.josm.tools.I18n.marktr;
import static org.openstreetmap.josm.tools.I18n.tr;

public class GetLayerAction extends JosmAction {

    public static final String NAME = marktr("Get Layer");
    //MapView mv = MainApplication.getMap().mapView;

    private static final String[] groups = {
            "", tr(""),
            "hotosm:households", "Household Points",  "hotosm:toilets", "Toilets","hotosm:wastepits", "Waste Pits","hotosm:clean_boundaries", "Clean Boundaries"};




    public GetLayerAction() {
        super(tr(NAME), "load.png", tr("Get Layer"), null, false);
    }

    @Override
    public void actionPerformed(ActionEvent arg0) {

        Logging.info("Getting boundaries...");
        addNewLayer();
    }


    public static void addNewLayer() {

        String filter;
        String layer;

        JLabel labelSectionNewLayer = new JLabel(tr("Add Layer"));
        JPanel p = new JPanel(new GridBagLayout());
        JLabel labelLayer = new JLabel(tr("Layer name"));
        final JComboBox<String> inputLayer = new JComboBox<>();

        for (int i = 1; i < groups.length; i += 2) {
            inputLayer.addItem(groups[i]);
        }
        inputLayer.setToolTipText(tr("<html>Layer</html>"));
        if (!Main.pref.get("kobo.layer").equals("")) {
            for (int i = 0; i < groups.length; i += 2) {
                if (groups[i].equals(Main.pref.get("kobo.layer")))
                    inputLayer.setSelectedIndex(i/2);

            }
        }

        p.add(labelSectionNewLayer, GBC.eol());
        p.add(labelLayer, GBC.std().insets(10, 0, 0, 0));
        p.add(inputLayer, GBC.eol().fill(GBC.HORIZONTAL).insets(5, 0, 0, 5));
        JOptionPane pane = new JOptionPane(p, JOptionPane.INFORMATION_MESSAGE, JOptionPane.OK_CANCEL_OPTION, null) {
            private static final long serialVersionUID = 1L;

            @Override
            public void selectInitialValue() {
                //inputTown.requestFocusInWindow();
                //inputTown.selectAll();
            }
        };

        pane.createDialog(Main.parent, tr("Download Layer")).setVisible(true);


        layer = groups[inputLayer.getSelectedIndex()*2];
        Main.pref.put("kobo.layer", layer);

        GeoserverApi client = new GeoserverApi();
        client.getLayer(layer,Main.pref.get("kobo.start"),Main.pref.get("kobo.end"));

        //GeoserverApi client = new GeoserverApi();





    }
}
